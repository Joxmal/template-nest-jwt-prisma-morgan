import { Injectable } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy} from '@nestjs/passport'
import { jwtConstants } from "./jwt-contanst";

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }
    
    async validate(payload: any) { //TODO id, name
        return { userId: payload.id, name: payload.name, role: payload.role };
  }
}