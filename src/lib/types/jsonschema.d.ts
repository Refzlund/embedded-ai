/**
 * As per https://json-schema.org/understanding-json-schema/
 *
 * * This is not fully fledged, and might need *some* types
*/
export namespace JsonSchema {
	export type BaseSchema<T> = {
		description: string
		examples?: T[]
		default: T
	}

	export type ObjectSchema = BaseSchema<ParameterSchema> & {
		type: 'object'
		properties: Record<string, ParameterSchema>
		required: string[]
		/** Added key-value pairs by necessity */
		additionalProperties?: {
			type: 'string' | 'number' | 'boolean' | 'null'
		}
		minProperties?: number
		maxProperties?: number
	}

	export type ArraySchema = BaseSchema<ParameterSchema | { enum: (string | number | boolean) }> & {
		type: 'array'
		/** AKA `tuple` */
		prefixItems: (ParameterSchema | { enum: (string | number | boolean)[] })[]
		/** 
		 * If added, this sets the array contents schema outside of prefixItems.
		 * If not added, the array contents schema is set by prefixItems only.
		*/
		items?: ParameterSchema
		/** Array must contain at least 1 of the schema provided for "contains". */
		contains?: ParameterSchema
		/** @defualt 1 */
		minContains?: number
		maxContains?: number
		minItems?: number
		maxItems?: number
		/** If true, will validate to have no array item duplicates */
		uniqueItems?: boolean
	}

	export type StringSchema = BaseSchema<string> & {
		type: 'string'
		enum?: string[]
		minLength?: number
		maxLength?: number
		/** RegEx */
		pattern?: string
	}

	export type NumberSchema = BaseSchema<number> & {
		/** Where `number` is analogous to the `float` type. */
		type: 'number' | 'integer'
		/** The number can be only be a multiplication if this number */
		multipleOf?: number
		/** `x ≥ minimum` */
		minimum?: number
		/** `x > exclusiveMinimum` */
		exclusiveMinimum?: number
		/** `x ≤ maximum` */
		maximum?: number
		/** `x < exclusiveMaximum` */
		exclusiveMaximum?: number
	}

	export type BooleanSchema = BaseSchema<boolean> & {
		type: 'boolean'
	}

	export type NullSchema = BaseSchema<null> & {
		type: 'null'
	}


	export type ParameterSchema =
		| ObjectSchema
		| ArraySchema
		| StringSchema
		| NumberSchema
		| BooleanSchema
		| NullSchema
}