import { Field, InputType } from "type-graphql";

@InputType()
export class CreatePlayedGameInput {
  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => Number, { nullable: true })
  personalScore?: number;

  @Field(() => String, { nullable: true })
  reviewNote?: string;

  @Field(() => String, { nullable: true })
  notes?: string;
}

@InputType()
export class UpdatePlayedGameInput {
  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => Number, { nullable: true })
  personalScore?: number;

  @Field(() => String, { nullable: true })
  reviewNote?: string;

  @Field(() => String, { nullable: true })
  notes?: string;
}
