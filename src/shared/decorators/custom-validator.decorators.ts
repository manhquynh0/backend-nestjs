import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export function Match(property: string, validationOptions?: ValidationOptions,) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isMatch',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints
                    const relatedValue = (args.object as any)[relatedPropertyName]
                    return value === relatedValue
                },
                defaultMessage(validationArguments: ValidationArguments) {
                    return `${validationArguments.property} do not match ${validationArguments.constraints[0]}`
                },
            },
        })
    }
}