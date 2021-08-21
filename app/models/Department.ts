import { AbstractModel } from "./AbstractModel";
import { SchemaDefinition, SchemaTypes } from "mongoose";

/**
 * Class Department
 */
class Department extends AbstractModel
{

    /**
     * @inheritDoc
     */
    constructor()
    {
        super("Department");
    }

    /**
     * @inheritDoc
     */
    public getSchemaDefinition(): SchemaDefinition
    {
        return {
            name: {
                type: SchemaTypes.String,
                required: true,
            },
            head: {
                type: SchemaTypes.ObjectId,
                required: true,
                ref: 'Lector'
            },
            created_at: {
                type: Date,
                required: true,
                default: Date.now()
            },
        };
    }

}

export default new Department();