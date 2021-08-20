import { AbstractModel } from "./AbstractModel";
import { SchemaDefinition, SchemaTypes } from "mongoose";

/**
 * Class Lector
 */
class Lector extends AbstractModel
{

    /**
     * @inheritDoc
     */
    constructor()
    {
        super("Lector");
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
            email: {
                type: SchemaTypes.String,
                required: true,
                unique: true,
                lowercase: true,
                trim: true
            },
            salary: {
                type: SchemaTypes.Number,
                required: true,
            },
            degree: {
                type: SchemaTypes.String,
                required: true,
                enum: ["assistant", "associate_professor", "professor"],
            },
            departments: [SchemaTypes.ObjectId],
            created_at: {
                type: Date,
                required: true,
                default: Date.now()
            },
        };
    }

}

export default new Lector();