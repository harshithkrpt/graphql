import { Resolver, Mutation, Arg, Int, Query } from "type-graphql";
import { Movie } from "../entity/Movie";

@Resolver()
export class MovieResolver {
  @Mutation(() => Movie)
  async createMovie(
    @Arg("title", () => String) title: string,
    @Arg("minutes", () => Int) minutes: number
  ) {
    const movie = await Movie.create({ title, minutes }).save();
    return movie;
  }

  @Mutation(() => Boolean)
  async updateMovie(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Arg("minutes", () => Int) minutes: number
  ) {
    await Movie.update({ id }, { title, minutes });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteMovie(@Arg("id", () => Int) id: number) {
    await Movie.delete({ id });
    return true;
  }

  @Query(() => [Movie])
  movies() {
    return Movie.find();
  }
}
