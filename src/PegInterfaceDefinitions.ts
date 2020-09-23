export interface TypedefObject {
    _type: 'typedef';
    doc?: string;
    base: boolean;
    origin?: FtypeObject;
    name: string;
    location: LocationObject;
}

export interface DefvObject {
    _type: 'defv';
    isParam?: boolean;
    guess?: string;
    doc?: string;
    tex?: string;
    type: TypeObject;
    name: string;
    location: LocationObject;
}

export interface DefunObject {
    _type: 'defun';
    doc?: string;
    tex?: string;
    rettype: TypeObject;
    name: string;
    params: DefvObject[];
    expr: Expr0Object;
    location: LocationObject;
}

export type Expr0Object = FuncallObject | FunexprObject | VarObject;
export type MetaexprObject = TeeObject | ReductionObject | SchemacallObject | VarObject | SchemaexprObject;

export interface DefschemaObject {
    _type: 'defschema';
    doc?: string;
    axiomatic: boolean;
    name: string;
    native: boolean;
    params?: DefvObject[];
    expr?: MetaexprObject;
    location: LocationObject;
}

export interface DefrulesetObject {
    _type: 'defruleset';
    doc?: string;
    axiomatic: boolean;
    name: string;
    native: true;
    location: LocationObject;
}

export interface ReductionObject {
    _type: 'reduction';
    subject: MetaexprObject;
    guesses?: Array<Expr0Object | null>;
    leftargs: MetaexprObject[];
    location: LocationObject;
}

export interface SchemacallObject {
    _type: 'schemacall';
    schema: MetaexprObject;
    args: Expr0Object[];
    location: LocationObject;
}

export interface FuncallObject {
    _type: 'funcall';
    schema: Expr0Object;
    args: Expr0Object[];
    location: LocationObject;
}

export interface FunexprObject {
    _type: 'funexpr';
    params: DefvObject[];
    expr: Expr0Object;
    location: LocationObject;
}

export interface SchemaexprObject {
    _type: 'schemaexpr';
    params: DefvObject[];
    expr: MetaexprObject;
    location: LocationObject;
}

export interface TeeObject {
    _type: 'tee';
    left: MetaexprObject[];
    right: MetaexprObject;
    location: LocationObject;
}

export interface StypeObject {
    _type: 'type';
    ftype: false;
    name: string;
    location: LocationObject;
}

export interface FtypeObject {
    _type: 'type';
    ftype: true;
    from: TypeObject[];
    to: TypeObject;
    location: LocationObject;
}

export type TypeObject = StypeObject | FtypeObject;

export interface VarObject {
    _type: 'var';
    type: '@' | '$' | 'ruleset' | 'normal';
    rulesetName?: string;
    name: string;
    location: LocationObject;
}

export interface LocationObject {
    start: LocationObjectInternal;
    end: LocationObjectInternal;
}

interface LocationObjectInternal {
    offset: number;
    line: number;
    column: number;
}