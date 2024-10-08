import { IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateJobDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required and should not be empty' })
    title!: string

    @IsString()
    @IsNotEmpty({ message: 'Description should not be empty' })
    description!: string

    @IsString()
    @IsOptional()
    company?: string

    @IsString()
    @IsOptional()
    location?: string

    @IsString()
    @IsOptional()
    employment_type?: string

    @IsString()
    @IsOptional()
    salary?: string

    @IsString()
    @IsOptional()
    requirements?: string

    @IsString()
    @IsOptional()
    responsibilities?: string

    @IsDate()
    @IsOptional()
    expiry_date?: true

    @IsString()
    @IsOptional()
    contact_information?: string

    @IsString()
    @IsOptional()
    application_process?: string

    @IsMongoId()
    @IsNotEmpty()
    posted_by?: string
}


