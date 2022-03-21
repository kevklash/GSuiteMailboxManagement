export type DataObj = {
	primaryEmail: string
	lastLoginTime: string
	recoveryEmail: string
	recoveryPhone: string
	orgUnitPath: Array<string>
	suspended: string
	suspensionReason: string
	isEnrolledIn2Sv: string
	id: string
}

type actorTypes = {
	callerType: string
	email: string
	profileId: string
}

type parametersType = {
	name: string
	value: string
}

type eventsTypes = {
	name: string
	parameters: Array<parametersType>
	type: string
}

type idTypes = {
	applicationName: string
	customerId: string
	time: string
	uniqueQualifier: string
}

export type LogsObj = {
	actor: actorTypes
	etag: string
	events: Array<eventsTypes>
	id: idTypes
	ipAddress: string
	kind: string
}

export interface UserLogsEndpointResponse {
	etag: string
	items?: Array<LogsObj>
	kind: string
}
