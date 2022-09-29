
const { exportJWK, generateKeyPair, importJWK } = require('jose')

export class JWKS  {
	constructor(jwksPrivate) {
		this._jwksPrivate = jwksPrivate
	}

	// Import _jwksPrivate and return raw keys
	rawKeys() {
        const algorithm = this._jwksPrivate[0].alg || 'RS256'
        return Promise.all(this._jwksPrivate.map((privateJwk) => importJWK(privateJwk, algorithm)))
	}

	// Return privateKeys keys
	privateKeys() {
        return this._jwksPrivate
	}

	// Import _jwksPrivate, export and return publicKeys keys
	publicKeys() {
        const keys = this.rawKeys()
        return Promise.all(keys.map((key) => exportJWK(key, false)))
	}

    static generateKeys(number, algorithm, size) {
        return Promise.all(
            Array(number)
                .fill(0)
                .map(() =>
                    generateKeyPair(algorithm, {
                        extractable: true,
                        modulusLength: size,
                        crv: size
                    }).then(({ privateKey }) => privateKey)
                )
        )
    }
}