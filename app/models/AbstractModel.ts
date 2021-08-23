import { SchemaDefinition, Model, Document, Schema, model } from "mongoose";

/**
 * class AbstractModel
 */
export abstract class AbstractModel
{

    /**
     * Mongoose model variable
     */
    public model: Model<Document>;

    /**
     * Mongoose schema
     * @protected
     */
    protected schema: Schema<Document>

    /**
     * @param modelName
     * @protected
     */
    protected constructor(modelName: string)
    {
        this.schema = new Schema(this.getSchemaDefinition(), {versionKey: false});

        this.schema.set('toJSON', {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret._id;
            }
        });

        this.model = model(modelName, this.schema);
    }

    /**
     * Init mongoose schema definition
     * @protected
     */
    public abstract getSchemaDefinition(): SchemaDefinition;

}