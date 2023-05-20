import { z } from "zod";
import { BaseOutputParser } from "../schema/output_parser.js";
export declare class StructuredOutputParser<T extends z.ZodTypeAny> extends BaseOutputParser<z.infer<T>> {
    schema: T;
    constructor(schema: T);
    static fromZodSchema<T extends z.ZodTypeAny>(schema: T): StructuredOutputParser<T>;
    static fromNamesAndDescriptions<S extends {
        [key: string]: string;
    }>(schemas: S): StructuredOutputParser<z.ZodObject<{
        [k: string]: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        [x: string]: string;
    }, {
        [x: string]: string;
    }>>;
    getFormatInstructions(): string;
    parse(text: string): Promise<z.infer<T>>;
}
