import {SchemaDefinition, Model, Document, Schema, model} from "mongoose";

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
            transform: function (doc, ret) {
                ret.id = ret._id;
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

    /**
     * Set document fields value
     * @param _id
     * @param update
     */
    public async setFields(_id: Buffer | string, update: object): Promise<void>
    {
        await this.model.updateOne({_id: _id}, update);
    }

    /**
     * Get field from document
     * @param _id
     * @param field
     */
    public async getField(_id: Buffer, field: string): Promise<any>
    {
        const document: any = await this.model.findOne({_id: _id}).lean();

        if (document[field]) {
            return {field: document[field]};
        }

        return null;
    }

}