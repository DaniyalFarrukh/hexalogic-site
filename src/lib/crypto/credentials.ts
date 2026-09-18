import crypto from 'crypto'
import { DECRYPT_FAILED_SENTINEL } from './sentinel'

export { DECRYPT_FAILED_SENTINEL }

const ALGORITHM = 'aes-256-gcm'

function getKey(): Buffer {
  const secret = process.env.CREDENTIALS_ENCRYPTION_KEY
  if (!secret) throw new Error('CREDENTIALS_ENCRYPTION_KEY is not set')
  const key = Buffer.from(secret, 'base64')
  if (key.length !== 32) throw new Error('CREDENTIALS_ENCRYPTION_KEY must be a base64-encoded 32-byte key')
  return key
}

/** Encrypts a credential password for storage. Format: v1:iv:authTag:ciphertext (all base64). */
export function encryptCredential(plaintext: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return ['v1', iv.toString('base64'), authTag.toString('base64'), ciphertext.toString('base64')].join(':')
}

/**
 * Decrypts a stored credential password. Rows written before this encryption was added are
 * plain text and won't match the v1 format — those are returned as-is rather than failing,
 * and get encrypted the next time they're saved.
 *
 * A v1-formatted value that fails to decrypt (wrong/rotated CREDENTIALS_ENCRYPTION_KEY, or
 * corruption) is a real error, not legacy data — returning the raw ciphertext here would let it
 * silently get re-encrypted as the "real" password on the next edit, destroying the original
 * value for good. So that case returns DECRYPT_FAILED_SENTINEL instead, which callers must check
 * for and refuse to persist.
 */
export function decryptCredential(stored: string): string {
  const parts = stored.split(':')
  if (parts.length !== 4 || parts[0] !== 'v1') return stored

  const [, ivB64, authTagB64, ciphertextB64] = parts
  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivB64, 'base64'))
    decipher.setAuthTag(Buffer.from(authTagB64, 'base64'))
    const plaintext = Buffer.concat([decipher.update(Buffer.from(ciphertextB64, 'base64')), decipher.final()])
    return plaintext.toString('utf8')
  } catch (err) {
    console.error('Failed to decrypt credential (wrong/rotated key?):', err)
    return DECRYPT_FAILED_SENTINEL
  }
}
