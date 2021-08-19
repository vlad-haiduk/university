import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm";

/**
 * Class Lector
 */
@Entity("lector")
export default class Lector
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
    private email: string;

    /**
     * @private
     */
    @Column()
    private degree: string;

    /**
     * @private
     */
    @Column()
    private salary: number

    /**
     * @private
     */
    @Column()
    private departments: Array<ObjectID>

    /**
     * @private
     */
    @Column()
    private created_at: Date

    /**
     * @param name
     * @return Lector
     */
    public setName(name: string)
    {
        this.name = name;

        return this;
    }

    /**
     * @param email
     * @return Lector
     */
    public setEmail(email: string)
    {
        this.email = email;

        return this;
    }

    /**
     * @param salary
     * @return Lector
     */
    public setSalary(salary: number)
    {
        this.salary = salary;

        return this;
    }

    /**
     * @param created_at
     * @return Lector
     */
    public setCreated(created_at: Date)
    {
        this.created_at = created_at;

        return this;
    }

}