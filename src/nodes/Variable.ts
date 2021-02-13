import Counter from '../Counter';
import ExecutionContext from '../ExecutionContext';
import { ProofType } from '../ProofType';
import StackTrace from '../StackTrace';
import Expr0 from './Expr0';
import Fun from './Fun';
import Metaexpr, { EqualsPriority, Precedence } from './Metaexpr';
import Nameable from './Nameable';

interface VariableArgumentType {
	doc?: string;
	tex?: string;
	sealed: boolean;
	type: ObjectType;
	name: string;
	expr: Expr0;
}

export default class Variable extends Expr0 implements Nameable {

	public readonly sealed: boolean;
	public readonly type: ObjectType;
	public readonly name: string;
	public readonly expr: Expr0 | null;

	constructor ({doc, tex, sealed, type, name, expr}: VariableArgumentType, trace: StackTrace) {
		super(doc, tex, type, trace);
		
		if (typeof name != 'string')
			throw Metaexpr.error('Assertion failed', trace);
		
		if (sealed && !expr) {
			throw Metaexpr.error('Cannot seal a primitive fun', trace);
		}

		if (expr && !type.equals(expr.type)) {
			throw Metaexpr.error(`Expression type ${expr.type} failed to match the type ${type} of variable ${name}`, trace);
		}

		this.sealed = sealed;
		this.name = name;
		this.expr = expr;
	}

	protected isProvedInternal(hypotheses: Metaexpr[]): boolean {
		return false;
	}

	public substitute(map: Map<Variable, Expr0>): Metaexpr {
		if (map.has(this)) return map.get(this);

		// 매크로 변수는 스코프 밖에서 보이지 않으므로 치환될 것을 갖지 않는다는
		// 생각이 들어 있다.
		return this;
	}

	protected expandMetaInternal(andFuncalls: boolean): Metaexpr {
		return this;
	}

	protected getEqualsPriority(context: ExecutionContext): EqualsPriority {
		return this.expr && (!this.sealed || context.canUse(this))
			? EqualsPriority.FOUR
			: EqualsPriority.ZERO;
	}

	protected equalsInternal(obj: Metaexpr, context: ExecutionContext): (Fun | Variable)[] | false {
		if (!this.expr) return false;

		if (!this.sealed || context.canUse(this)) {
			var tmp = this.expr.equals(obj, context);
			if (!tmp) return tmp;
			return tmp.push(this), tmp;
		}

		return false;
	}

	protected getProofInternal(
			hypnumMap: Map<Metaexpr, number>,
			$Map: Map<Metaexpr, number | [number, number]>,
			ctr: Counter): ProofType[] {
		
		return [{
			_type: 'NP',
			ctr: ctr.next(),
			expr: this
		}];
	}

	// pr f
	public toSimpleString() {
		return this.type.toString() + ' ' + this.name;
	}

	public toIndentedString(indent: number, root?: boolean): string {
		return `${root ? this.type + ' ' : ''}${this.name}<${this._id}>`;
	}

	public toTeXString(prec?: Precedence, root?: boolean): string {
		var id = this instanceof Parameter ? `id-${this._id}` : `def-${this.name}`;

		var tex = this.tex || Metaexpr.makeTeXName(this.name);
		
		var expr = root && this.expr
			? `\\coloneqq ${this.expr.toTeXString(Metaexpr.PREC_COLONEQQ)}`
			: '';
		
		return `\\href{#${id}}{${tex}}${expr}`;
	}
}

import Parameter from './Parameter';
import { ObjectType } from './types';
