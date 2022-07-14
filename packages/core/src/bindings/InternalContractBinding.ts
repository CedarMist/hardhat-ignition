import { Contract } from "../types";

import { InternalBinding } from "./InternalBinding";
import { ContractOptions } from "./types";
import { combineArgsAndLibrariesAsDeps } from "./utils";

export class InternalContractBinding extends InternalBinding<
  ContractOptions,
  Contract
> {
  public getDependencies(): InternalBinding[] {
    return combineArgsAndLibrariesAsDeps(
      this.input.args,
      this.input.libraries ?? {}
    );
  }
}