import { IsString } from "class-validator";

export class LoginAuthDto {

@IsString()
name: string;
    
@IsString()
password: string;


}
