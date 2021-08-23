import logger from "morgan";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import statusCodes from "http-status-codes";
import axios from "axios";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(helmet.hidePoweredBy());

app.post('/message', async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.message) {
        /** 1. command - head of department */
        let matches = req.body['message'].match(/^Who is head of department (.*?)$/);
        if (matches && matches.length > 1) {
            const department = await request("department/find", {name: matches[1]});
            if (department.length > 0) {
                const lector = await request(`lector/${department[0].head}`, {});
                if (lector) {
                    res.status(statusCodes.OK).json({
                        message: `Head of ${department[0].name} department is ${lector.name}`
                    });
                }
            } else {
                res.status(statusCodes.OK).json({
                    message: `Not found department with name ${matches[1]}`
                });
            }
        }

        /** 2. command - department statistic */
        matches = req.body['message'].match(/^Show (.*?) statistic$/);
        if (matches && matches.length > 1) {
            const department = await request("department/find", {name: matches[1]});
            if (department.length > 0) {
                const list = await request("lector/find", {department: department[0].id});
                const assistants = list.filter((lector: any) => {
                    return lector.degree === "assistant";
                });

                const associate_professors = list.filter((lector: any) => {
                    return lector.degree === "associate_professor";
                });

                const professors = list.filter((lector: any) => {
                    return lector.degree === "professor";
                });

                res.status(statusCodes.OK).json({
                    message: `assistants - ${assistants.length}. associate professors - ${associate_professors.length}. professors - ${professors.length}`
                });
            } else {
                res.status(statusCodes.OK).json({
                    message: `Not found department with name ${matches[1]}`
                });
            }
        }

        /** 3. command - average salary for department */
        matches = req.body['message'].match(/^Show the average salary for department (.*?)$/);
        if (matches && matches.length > 1) {
            const department = await request("department/find", {name: matches[1]});
            if (department.length > 0) {
                const list = await request("lector/find", {department: department[0].id});

                let average_salary: number = 0;

                list.forEach((lector: any) => {
                    average_salary += lector.salary;
                });

                average_salary = average_salary / list.length;

                res.status(statusCodes.OK).json({
                    message: `The average salary of ${department[0].name} is ${average_salary}`
                });
            } else {
                res.status(statusCodes.OK).json({
                    message: `Not found department with name ${matches[1]}`
                });
            }
        }

        /** 4. command - count of employee for department */
        matches = req.body['message'].match(/^Show count of employee for (.*?)$/);
        if (matches && matches.length > 1) {
            const department = await request("department/find", {name: matches[1]});
            if (department.length > 0) {
                const list = await request("lector/find", {department: department[0].id});

                res.status(statusCodes.OK).json({
                    message: list.length
                });
            } else {
                res.status(statusCodes.OK).json({
                    message: `Not found department with name ${matches[1]}`
                });
            }
        }

        /** 5. global search by template */
        matches = req.body['message'].match(/^Global search by (.*?)$/);
        if (matches && matches.length > 1) {
            let department_list = await request("department/list", {});

            department_list = department_list.filter((department: any) => {
                return -1 !== department.name.indexOf(matches[1]);
            });

            let lector_list = await request("lector/list", {});

            lector_list = lector_list.filter((lector: any) => {
                return -1 !== lector.name.indexOf(matches[1]);
            });

            res.status(statusCodes.OK).json({
                message: `departments: ${department_list.map((dep: any) => dep.name).join(',')}, lectors: ${lector_list.map((lec: any) => lec.name).join(',')}`
            });
        }

        if (!res.headersSent) {
            res.status(statusCodes.OK).json({
                message: "Invalid message format"
            });
        }
    } else {
        res.status(statusCodes.BAD_REQUEST).json({
            message: "Message not found"
        });
    }
});

/**
 * @param   path
 * @param   params
 * @returns response
 */
async function request(path: string, params: object) {
    const response: any = await axios.request({
        url: `http://app:3000/${path}`,
        params: params,
        method: "GET"
    });

    return response.data.data || [];
}

app.listen(3001, () => {
    console.log("Api started on port 3001");
});