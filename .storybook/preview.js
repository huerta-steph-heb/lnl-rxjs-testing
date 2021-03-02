
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);

import "!style-loader!css-loader!../node_modules/@mortar/web/mortar-angular.css";
import "!style-loader!css-loader!../node_modules/@mortar/web/mortar-css-reset.css";
import "!style-loader!css-loader!../node_modules/@mortar/web/mortar-web-grid.css";
import "!style-loader!css-loader!../node_modules/@mortar/web/mortar-web-utilities.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
