
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-amazon";
import { SOCIAL_LOGIN_TYPE } from "../../shared/enums";
import { UserService } from "../../users/users.service";

@Injectable()
export class AmazonStrategy extends PassportStrategy(Strategy, "amazon") {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.AMAZON_APP_ID,
      clientSecret: process.env.AMZON_APP_SECRET,
      callbackURL: process.env.BASE_URL + "auth/amazon/callback",
      scope: "email",
      profileFields: ["email", "name"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { id, name, emails } = profile;

    const user = {
      id: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };

    //Check if the id exists in the database
    //If exists in database then return the record as is
    // const socialRecord = await this.userService.findOrCreateSocialRecord(id, SOCIAL_LOGIN_TYPE.AMAZON, user.email, user.firstName, user.lastName);
    // console.log("Social record is: ", socialRecord);

    //Check if the user exists

    const payload = {
      user,
      accessToken
    };

    done(null, payload);
  }
}