// src/server.js
import { createServer, Model } from 'miragejs'

export function makeServer({ environment = 'test' } = {}) {
	let server = createServer({
		environment,

		models: {
			user: Model,
		},

		seeds(server) {
			server.create('user', {
				primaryEmail: 'hector.serrano@telus.com',
				lastLoginTime: 'yesterday',
				recoveryEmail: 'fonto.serrano@gmail.com',
				recoveryPhone: '77124644',
				orgUnitPath: ['ou', 'users', 'consumer'],
				suspended: 'false',
				isEnrolledIn2Sv: 'true',
				id: '309234293849234893284',
			})
		},

		routes() {
			this.namespace = '/action'
			this.urlPrefix = 'http://localhost:5000'

			this.get('/users', schema => {
				return schema.users.all()
			})
		},
	})

	return server
}
