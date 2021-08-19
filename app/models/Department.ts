import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm";

/**
 * Class Department
 */
@Entity("department")
export default class Department
{

    /**
     * @private
     */
    @ObjectIdColumn()
    private id: ObjectID;

    /**
     * @private
     */
    @Column()
    private name: string;

    /**
     * @private
     */
    @Column()
    private head: ObjectID;

    /**
     * @private
     */
    @Column()
    private created_at: Date

    /**
     * @param name
     * @return Department
     */
    public setName(name: string)
    {
        this.name = name;

        return this;
    }

    /**
     * @param head
     * @return Department
     */
    public setHead(head: ObjectID)
    {
        this.head = head;

        return this;
    }

    /**
     * @param created_at
     * @return Department
     */
    public setCreated(created_at: Date)
    {
        this.created_at = created_at;

        return this;
    }

}