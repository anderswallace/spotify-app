import { css } from "styled-components/macro";

const fonts = css`
  @font-face {
    font-family: "PP Object Sans";
    src: url("../fonts/PPObjectSans-Regular.otf") format("otf"),
      url("../fonts/PPObjectSans-Regular.otf") format("otf");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "PP Object Sans";
    src: url("../fonts/PPObjectSans-Slanted.otf") format("otf"),
      url("../fonts/PPObjectSans-Slanted.otf") format("otf");
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: "PP Object Sans";
    src: url("../fonts/PPObjectSans-HeavySlanted.otf") format("otf"),
      url("../fonts/PPObjectSans-HeavySlanted.otf") format("otf");
    font-weight: 900;
    font-style: normal;
  }
`;

export default fonts;
