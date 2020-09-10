code = String.raw`
#####################################
######## PROPOSITIONAL LOGIC ########
#####################################

"문장 타입."
base type st;

"verum (T). 즉 임의의 항진명제를 표시한다."
$\top$
st T;

"falsum (F). 즉 임의의 모순명제를 표시한다."
$\bot$
st F;

"not (FT)."
$!<prec=250><<\neg>>#1$
st N(st p);

"and (TFFF)."
$!<prec=596>#1<<\land>>#2$
st A(st p, st q);

"or (TTTF)."
$!<prec=596>#1<<\lor>>#2$
st O(st p, st q);

"implies (TFTT)."
$!<prec=598>#1<<\to>>#2$
st I(st p, st q);

"iff (TFFT)."
$!<prec=599>#1<<\leftrightarrow>>#2$
st E(st p, st q);

"진리표를 만들어 봤을 때 값이 항상 참인 명제 [$p]에 대하여 [$\vdash p]를 포함한다. 어떤 규칙에 접근하려면 Polish notation으로 된 이름을 만들어야 한다.

[ul
	[*] 말단
		[ul
			[*] p, q, r, s, t, u, v, w, x, y, z: 순서대로 1~11번째의 st 타입 입력항.
			[*] T: verum ([$\top]). true의 T.
			[*] F: falsum ([$\bot]). false의 F.
		]
	[*] 일항 연산자
		[ul
			[*] N: not ([$\neg]).
		]
	[*] 이항 연산자
		[ul
			[*] A: and ([$\land]).
			[*] O: or ([$\lor]).
			[*] I: implies ([$\to]).
			[*] E: iff ([$\leftrightarrow]). equivalent의 E인 것으로 하자.
		]
]

대소문자를 구분하고 괄호를 사용하지 않으며 연산자를 맨 앞에 쓰고 인자를 이어 쓴다.

[> 예를 들어 [$\vdash p \land q]는 Apq, [$\vdash \neg (p \land q) \leftrightarrow (\neg p \lor \neg q)]는 ENApqONpNq가 된다.]

tt에 포함되어 있는 규칙의 [$\vdash]의 좌변에는 아무 것도 없으므로, 뭔가를 좌변에 넣으려면 modus ponens를 적용해야 한다.

이후 이것을 없애고 한정된 몇 가지의 규칙만을 사용하여 공리계를 구축하여야 할 것이다.

[~(href=./tt.html)인터랙티브 페이지]"
axiomatic native ruleset tt;

"sequent calculus의 cut 규칙. 즉
[$$\frac{\Delta\vdash p\quad \Sigma_1,p,\Sigma_2\vdash q}{\Sigma_1,\Delta,\Sigma_2\vdash q}]
이다. 단 [$p]의 첫 번째 일치가 [$\Delta]로 치환된다. 즉 [$\Sigma_1]에는 [$p]가 없다.

1계층 reduction 구문을 도입한다면 그로부터 증명할 수 있다."
axiomatic native schema cut;

"함의 도입(implication introduction). conditional proof를 가능케 한다. 특정 힐베르트 체계(Hilbert system)에서는 메타정리(metatheorem)이며 이를 연역 정리(deduction theorem)라 부른다. 즉
[$$\frac{\Delta, p\vdash q}{\Delta\vdash p\to q}]
에 해당한다."
axiomatic native schema cp;

"cp의 네이티브 하지 않은 버전."
axiomatic schema cpn(st p: @11, st q: @1r) {
	(p |- q) |- I(p, q)
}

"modus ponens. 함의 소거(implication elimination) 또는 전건 긍정이라고도 한다."
axiomatic schema mp(st p: @1, st q: @22) {
	p, I(p, q) |- q
}

"mp의 다른 버전. 즉
[$$\frac{\Delta\vdash p\to q}{\Delta, p\vdash q}]
이다. mp보다 적용하는 것이 간단하다. mp로부터 증명할 수 있으나 아직 표현할 수 있는 방법이 없다."
axiomatic native schema mpu;

"연언 도입(conjunction introduction)."
schema Ai(st p: @1, st q: @2) {
	mpu[mpu[tt.IpIqApq(p, q)]]
}

"연언 도입 2번."
schema A3i(st p: @1, st q: @2, st r: @3) {
	p, q, r |- Ai[Ai[p, q], r]
}

"연언 소거(conjunction elimination) 1."
schema Ae1(st p: @11, st q: @12) {
	mpu[tt.IApqp(p, q)]
}

"연언 소거(conjunction elimination) 2."
schema Ae2(st p: @11, st q: @12) {
	mpu[tt.IApqq(p, q)]
}

"선언 도입(disjunction introduction) 1."
schema Oi1(st p: @1, st q) {
	mpu[tt.IpOpq(p, q)]
}

"선언 도입(disjunction introduction) 2."
schema Oi2(st p, st q: @1) {
	mpu[tt.IqOpq(p, q)]
}

"선언 소거(disjunction elimination). proof by cases라고도 한다."
schema Oe(st p: @11, st q: @12, st r: @22) {
	A3i(
		O(p, q),
		I(p, r),
		I(q, r)
	)
	~ mpu[tt.IAAOpqIprIqrr(p, q, r)]
}

schema Oeu(st p: @11, st q: @12, st r: @2r) {
	O(p, q), (p |- r), (q |- r) |- Oe[
		O(p, q),
		cpn[p |- r],
		cpn[q |- r]
	]
}

"부정 도입(negation introduction). 귀류법(reductio ad absurdum)이라고도 한다."
schema Ni(st p: @11) {
	mpu[tt.IIpFNp(p)]
}

schema Niu(st p: @11) {
	(p |- F) |-
		Ni[cpn[p |- F]]
}

"부정 소거(negation elimination). 폭발률(ex falso quodlibet)이라고도 한다."
schema Ne(st p: @1, st q) {
	mpu[mpu[tt.IpINpq(p, q)]]
}

"이중부정 도입(double negation introduction)."
schema NNi(st p: @1) {
	mpu[tt.IpNNp(p)]
}

"이중부정 소거(double negation elimination)."
schema NNe(st p: @111) {
	mpu[tt.INNpp(p)]
}

"쌍조건문 도입(biconditional introduction)."
schema Ei(st p: @11, st q: @12) {
	Ai(I(p, q), I(q, p))
	~ mpu[tt.IAIpqIqpEpq(p, q)]
}

"쌍조건문 소거(biconditional elimination) 1."
schema Ee1(st p: @11, st q: @12) {
	mpu[tt.IEpqIpq(p, q)]
}

"쌍조건문 소거(biconditional elimination) 2."
schema Ee2(st p: @11, st q: @12) {
	mpu[tt.IEpqIqp(p, q)]
}

schema IEpqEqpm(st p: @11, st q: @12) {
	E(p, q) |- Ei[Ee2[E(p, q)], Ee1[E(p, q)]]
}

schema IpIqpm(st p: @1, st q) {
	p |- cp[
		q |- p
	][]
}

"E를 위한 mp."
schema mpE(st p: @11, st q: @12) {
	mpu[Ee1(p, q)]
}

"가언적 삼단논법(hypothetical syllogism)."
schema syll(st p: @11, st q: @12, st r: @22) {
	I(p, q), I(q, r) |- cp[
		p |- mp[mp[p, I(p, q)], I(q, r)]
	][]
}

"syll을 두 번 적용한 것. 사단논법이라 해도 좋을 것이다."
schema syll4(st p: @11, st q: @21, st r: @31, st s: @32) {
	syll(p, q, r) ~ syll(p, r, s)
}

"E를 위한 syll."
schema syllE(st p, st q, st r) {
	E(p, q), E(q, r) |- Ei[
		syll[
			Ee1[E(p, q)],
			Ee1[E(q, r)]
		],
		syll[
			Ee2[E(q, r)],
			Ee2[E(p, q)]
		]
	]
}

schema syllE4(st p, st q, st r, st s) {
	syllE(p, q, r) ~ syllE(p, r, s)
}

"sequent calculus의 I 규칙 같은 것. 표현형식을 바꾸는 데 쓰이고 있다."
schema id(st p: @1) {
	p |- p
}

"[$\bot]을 도입한다. falsum introduction이라 불러도 좋을 것이다."
schema Fi(st p: @1) {
	Ne(p, F)
}

schema Fi_c(st p: @11) {
	N(p) |- cpn[p |- Fi[p, N(p)]]
}

"[$\bot]을 소거한다. falsum elimination이라 불러도 좋을 것이다. Ne와 마찬가지로 폭발률을 나타낸다 할 수 있다."
schema Fe(st p) {
	mpu[tt.IFp(p)]
}

"대우명제(contrapositive)를 유도한다."
schema contrapose(st p: @11, st q: @12) {
	mpu[tt.IIpqINqNp(p, q)]
}

"contrapose의 다른 버전."
schema contrapose_u(st p: @11, st q: @1r) {
	(p |- q) |- N(q) |- mp[N(q), contrapose[cpn[p |- q]]]
}

"후건 부정(modus tollens)."
schema mt(st p, st q) {
	mpu[contrapose(p, q)]
}

schema NO_to_AN(st p: @111, st q: @112) {
	N(O(p, q)) |-
		Ai[
			Niu[
				p |-
					Fi[
						Oi1(?, q)[p],
						N(O(p, q))
					]
			],
			Niu[
				q |-
					Fi[
						Oi2(p, ?)[q],
						N(O(p, q))
					]
			]
		]
}

schema AN_to_NO(st p: @111, st q: @121) {
	A(N(p), N(q)) |-
		Niu[O(p, q) |- Oe[
			O(p, q),
			Fi_c[Ae1[A(N(p), N(q))]],
			Fi_c[Ae2[A(N(p), N(q))]]
		]]
}

schema NA_to_ON(st p: @111, st q: @112) {
	N(A(p, q)) |-
		NNe[Niu[N(O(N(p), N(q))) |- Fi[
			Ai[
				NNe[Ae1[NO_to_AN[N(O(N(p), N(q)))]]],
				NNe[Ae2[NO_to_AN[N(O(N(p), N(q)))]]]
			],
			N(A(p, q))
		]]]
}

schema ON_to_NA(st p: @111, st q: @112) {
	O(N(p), N(q)) |-
		Niu[A(p, q) |- Oeu[
			O(N(p), N(q)),
			(N(p) |- Fi[
				Ae1[A(p, q)], N(p)
			]),
			(N(q) |- Fi[
				Ae2[A(p, q)], N(q)
			])
		]]
}

schema swap(st p, st q, st r) {
	I(p, I(q, r)) |- cp[
		q |- cp[
			p |- mp[
				q, mp[
					p, I(p, I(q, r))
				]
			]
		][]
	][]
}

schema swap_c(st p, st q, st r) {
	cp[swap(p, q, r)]
}

schema swap_m(st p, st q, st r) {
	mpu[swap(p, q, r)]
}



#################################
######## PREDICATE LOGIC ########
#################################

"클래스 타입. 술어 논리에서 쓰인다."
type cls;

"class 하나를 받는 술어 타입."
type [cls -> st] pr;

"class 두 개를 받는 술어 타입."
type [(cls, cls) -> st] pr2;

"class 세 개를 받는 술어 타입."
type [(cls, cls, cls) -> st] pr3;

"pr 타입을 위한 A."
$\left(#1<<\land>>#2\right)$
pr Af(pr f, pr g) {
	(cls z) => { A(f(z), g(z)) }
}

"pr 타입을 위한 O."
$\left(#1<<\lor>>#2\right)$
pr Of(pr f, pr g) {
	(cls z) => { O(f(z), g(z)) }
}

"pr 타입을 위한 I."
$\left(#1<<\to>>#2\right)$
pr If(pr f, pr g) {
	(cls z) => { I(f(z), g(z)) }
}

"pr 타입을 위한 E."
$\left(#1<<\leftrightarrow>>#2\right)$
pr Ef(pr f, pr g) {
	(cls z) => { E(f(z), g(z)) }
}

"pr 타입을 위한 N."
$\left(<<\neg>>#1\right)$
pr Nf(pr f) {
	(cls z) => { N(f(z)) }
}

"보편 양화(universal quantification). 일반적인 표기법과는 다르게 pr을 입력으로 받는다. 또한 [*domain of discourse는 공집합일 수도 있다]."
$!<prec=249><<\forall>>#1$
st V(pr f);

"pr2를 위한 보편 양화."
$!<prec=249><<\forall^2>>#1$
st V2(pr2 f) {
	V((cls x) => {
		V((cls y) => {
			f(x, y)
		})
	})
}

"pr3을 위한 보편 양화."
$!<prec=249><<\forall^3>>#1$
st V3(pr3 f) {
	V((cls x) => {
		V((cls y) => {
			V((cls z) => {
				f(x, y, z)
			})
		})
	})
}

"존재 양화(existential quantification). 일반적인 표기법과는 다르게 pr을 입력으로 받으며 V에 의존한다. 또한 [*domain of discourse는 공집합일 수도 있다]."
$!<prec=249><<\exists>>#1$
st X(pr f) {
	N(V((cls x) => { N(f(x)) }))
}

"pr2를 위한 존재 양화. V2에 의존한다."
$!<prec=249><<\exists^2>>#1$
st X2(pr2 f) {
	N(V2((cls x, cls y) => { N(f(x, y)) }))
}

schema NX_to_VN(pr f) {
	N(X(f)) |- id(V(Nf(f)))[NNe[N(X(f))]]
}

schema VN_to_NX(pr f) {
	V(Nf(f)) |- id(N(X(f)))[NNi[V(Nf(f))]]
}

"보편 양화 도입(universal introduction)."
axiomatic schema Vi(pr f: @1) {
	f |- V(f)
}

"보편 양화 소거(universal elimination)."
axiomatic schema Ve(pr f: @11, cls x) {
	V(f) |- f(x)
}

"Vi의 다른 버전."
schema Viu(pr f) {
	(cls x) => { |- f(x) } |-
		|- id(V(f))[Vi[(cls x) => {((cls x) => { |- f(x) })(x)[]}]]
}

"Ve의 다른 버전."
schema Veu(pr f, cls x) {
	(|- V(f)) |-
		|- Ve(?, x)[(|- V(f))[]]
}

schema Vi_p(st p) {
	p |- Vi((cls x) => { p })[(cls x) => { p }]
}

schema Vi_c(st p) {
	cp[Vi_p(p)]
}

"V를 위한 contrapose."
schema contrapose_V(pr f: @111, pr g: @112) {
	V(If(f, g)) |- Vi[(cls x) => {
		contrapose(f(x), g(x))[Ve(?, x)[V(If(f, g))]]
	}]
}

"V를 위한 mp."
schema mpV(pr f: @11, pr g: @212) {
	V(f), V(If(f, g)) |-
		id(V(g))[Vi[(cls x) => {
			mp[Ve(?, x)[V(f)], Ve(?, x)[V((cls x) => { I(f(x), g(x)) })]]
		}]]
}

"V를 위한 mt."
schema mtV(pr f: @111, pr g: @112) {
	V(If(f, g)), N(V(g)) |-
		Niu[
			V(f) |-
				Ne(?, F)[
					mpV[V(f), V(If(f, g))],
					N(V(g))
				]
		]
}

"VA의 m1형."
schema VAm1(pr f: @111, pr g: @112) {
	V(Af(f, g)) |-
		Ai[
			Vi[(cls x) => {
				Ae1[id(A(f(x), g(x)))[Ve(?, x)[V(Af(f, g))]]]
			}],
			Vi[(cls x) => {
				Ae2[id(A(f(x), g(x)))[Ve(?, x)[V(Af(f, g))]]]
			}]
		]
	~ id(A(V(f), V(g)))
}

"VA의 m2형."
schema VAm2(pr f: @111, pr g: @121) {
	A(V(f), V(g)) |-
		id(V(Af(f, g)))[
			Vi[(cls x) => {
				Ai[
					Ve(?, x)[Ae1[A(V(f), V(g))]],
					Ve(?, x)[Ae2[A(V(f), V(g))]]
				]
			}]
		]
}

"[$\forall]과 [$\land] 간의 분배법칙 같은 것."
schema VA(pr f, pr g) {
	|- Ei[cp[VAm1(f, g)][], cp[VAm2(f, g)][]]
}

"VI의 m형."
schema VIm(pr f: @111, pr g: @112) {
	V(If(f, g)) |-
		cpn[V(f) |- mpV[V(f), V(If(f, g))]]
}

"[$\forall]과 [$\to] 간의 분배법칙 같은 것."
schema VI(pr f, pr g) {
	|- cpn[VIm(f, g)]
}

"V를 위한 Oi1."
schema Oi1V(pr f, pr g) {
	V(f) |-
		id(V(Of(f, g)))[
			Vi[(cls x) => {
				Oi1(?, g(x))[Ve(?, x)[V(f)]]
			}]
		]
}

"V를 위한 Oi2."
schema Oi2V(pr f, pr g) {
	V(g) |-
		id(V(Of(f, g)))[
			Vi[(cls x) => {
				Oi2(f(x), ?)[Ve(?, x)[V(g)]]
			}]
		]
}

schema VOm(pr f, pr g) {
	O(V(f), V(g)) |-
		Oe[
			O(V(f), V(g)),
			cpn[Oi1V(f, g)],
			cpn[Oi2V(f, g)]
		]
}

schema VO(pr f, pr g) {
	|- cpn[VOm(f, g)]
}

"VV의 m형. 재미있게도 Vi 및 Ve로부터 유도할 수 있다."
schema VVm(pr2 f) {
	V2((cls x, cls y) => { f(x, y) }) |-
		Vi[(cls y) => {
			Vi[(cls x) => {
				Ve(?, y)[Ve(?, x)[V2((cls x, cls y) => { f(x, y) })]]
			}]
		}]
	~ id(V2((cls y, cls x) => { f(x, y) }))
}

"[$\forall x\forall y]랑 [$\forall y\forall x]가 같다는 것."
schema VV(pr2 f) {
	cp[VVm(f)]
}

"IEpqEqpm의 V형."
schema IVEpqVEqpfm(pr f, pr g) {
	mpu[
		Viu((cls x) => {
			I(E(f(x), g(x)), E(g(x), f(x)))
		})[(cls x) => { tt.IEpqEqp(f(x), g(x)) }]
		~ VIm(
			(cls x) => { E(f(x), g(x)) },
			(cls x) => { E(g(x), f(x)) }
		)
	]
}

"Ee1의 V형."
schema Ee1V(pr f: @111, pr g: @112) {
	id(V(Ef(f, g))) ~
	mpu[
		Viu((cls x) => {
			I(E(f(x), g(x)), I(f(x), g(x)))
		})[(cls x) => {tt.IEpqIpq(f(x), g(x))}]
		~ VIm(
			(cls z) => { E(f(z), g(z)) },
			(cls z) => { I(f(z), g(z)) }
		)
	]
	~ id(V(If(f, g)))
}

"Ee2의 V형."
schema Ee2V(pr f, pr g) {
	IVEpqVEqpfm(f, g)
	~ Ee1V(g, f)
}

schema VEm(pr f, pr g) {
	Ee1V(f, g)
	~ VIm(f, g)
	~ Ee2V(f, g)
	~ VIm(g, f)
	~ Ei(V(f), V(g))
}

schema VE(pr f, pr g) {
	cp[VEm(f, g)]
}

schema syllV(pr f: @111, pr g: @112, pr h: @212) {
	Ai(
		V(If(f, g)),
		V(If(g, h))
	)
	~ VAm2(
		(cls x) => { I(f(x), g(x)) },
		(cls x) => { I(g(x), h(x)) }
	)
	~ mpu[
		Viu((cls x) => {
			I(A(I(f(x), g(x)), I(g(x), h(x))), I(f(x), h(x)))
		})[(cls x) => {tt.IAIpqIqrIpr(f(x), g(x), h(x))}]
		~ VIm(
			(cls x) => { A(I(f(x), g(x)), I(g(x), h(x))) },
			(cls x) => { I(f(x), h(x)) }
		)
	]
}

schema syllVE(pr f, pr g, pr h) {
	Ai(
		V((cls w) => { E(f(w), g(w)) }),
		V((cls w) => { E(g(w), h(w)) })
	)
	~ VAm2(
		(cls w) => { E(f(w), g(w)) },
		(cls w) => { E(g(w), h(w)) }
	)
	~ mpu[
		Viu((cls x) => {
			I(A(E(f(x), g(x)), E(g(x), h(x))), E(f(x), h(x)))
		})[(cls x) => {tt.IAEpqEqrEpr(f(x), g(x), h(x))}]
		~ VIm(
			(cls w) => { A(E(f(w), g(w)), E(g(w), h(w))) },
			(cls w) => { E(f(w), h(w)) }
		)
	]
}

schema VI_Vi(st p, pr f) {
	Vi_c(p) ~
	VIm((cls z) => {p}, f)
	~ syll(
		p,
		V((cls z) => {p}),
		V(f)
	)
}

schema VI_Vi_c(st p, pr f) {
	cp[VI_Vi(p, f)]
}

schema VI_Vi_V2(pr f, pr2 g, cls z) {
	VI_Vi_c(f(z), (cls w) => {g(z, w)})
}

schema VI_Vi_V2_Vi(pr f, pr2 g) {
	Viu((cls z) => {
		I(V((cls w) => {I(f(z), g(z, w))}), I(f(z), V((cls w) => {g(z, w)})))
	})[(cls z) => {VI_Vi_V2(f, g, z)}]
}

schema VI_Vi_V2_Vi_VI(pr f, pr2 g) {
	VI_Vi_V2_Vi(f, g)
	~ VIm(
		(cls z) => {
			V((cls w) => {
				I(f(z), g(z, w))
			})
		},
		(cls z) => {
			I(
				f(z),
				V((cls w) => {
					g(z, w)
				})
			)
		}
	)
}

schema VI_Vi_V2_Vi_VI_m(pr f, pr2 g) {
	id(V2((cls z, cls w) => {
		I(f(z), g(z, w))
	})) ~
	mpu[VI_Vi_V2_Vi_VI(f, g)]
}

"존재 양화 도입(existential introduction). Ve와 합치면 [$\forall f \vdash \exists f]가 될 것도 같으나 어떤 class x가 있어야 한다."
schema Xi(pr f, cls x) {
	NNi(f(x)) ~
	mpu[
		cp[Ve(Nf(f), x)]
		~ contrapose(V(Nf(f)), N(f(x)))
	] ~ id(X(f))
}

"X를 위한 mp."
schema mpX(pr f: @11, pr g: @212) {
	X(f), V(If(f, g)) |-
		id(X(g))[mtV(Nf(g), Nf(f))[contrapose_V[V(If(f, g))], X(f)]]
}

"mpX의 더 강력한 버전."
schema mpX_strong(pr f, pr g) {
	X(f), V(If(f, g)) |-
		mpX(?, Af(f, g))[
			X(f),
			Vi[(cls x) => {
				cpn[
					f(x) |-
						Ai[
							f(x),
							mp(f(x), g(x))[f(x), Ve(?, x)[V(If(f, g))]]
						]
				]
			}]
		]
}

schema mpXE(pr f, pr g) {
	X(f), V(Ef(f, g)) |-
		mpX[X(f), Ee1V[V(Ef(f, g))]]
}

"st 타입을 위한 존재 양화 소거(existential elimination)."
schema Xe_p(st p) {
	id(X((cls x) => {p})) ~
	mpu[cp[Vi_p(N(p))]
	~ mpu[tt.IINpqINqp(p, V((cls x) => { N(p) }))]]
}

schema mpX_Xe_p(pr f, st p) {
	mpX(f, (cls x) => { p })
	~ Xe_p(p)
}

"[$\exists]과 [$\lor] 간의 분배법칙 같은 것. VA로부터 증명할 수 있다."
schema XO(pr f, pr g) {
	(VA(Nf(f), Nf(g)) ~
	mpu[tt.IEpAqrENpONqNr(
		V(Af(Nf(f), Nf(g))), V(Nf(f)), V(Nf(g))
	)])
	~ ((
		Viu((cls x) => {
			E(N(O(f(x), g(x))), A(N(f(x)), N(g(x))))
		})[(cls x) => {tt.ENOpqANpNq(f(x), g(x))}]
		~ VEm(
			(cls x) => { N(O(f(x), g(x))) },
			(cls x) => { A(N(f(x)), N(g(x))) }
		)
	)
	~ mpu[tt.IEpqENpNq(
		V((cls x) => { N(O(f(x), g(x))) }),
		V((cls x) => { A(N(f(x)), N(g(x))) })
	)])
	~ syllE(
		X(Of(f, g)),
		N(V(Af(Nf(f), Nf(g)))),
		O(X(f), X(g))
	)
}

schema ON_to_NA_V(pr f, pr g) {
	V(Of(Nf(f), Nf(g))) |-
		Vi[(cls x) => {
			ON_to_NA(f(x), g(x))[Ve(?, x)[V(Of(Nf(f), Nf(g)))]]
		}]
}

"XA의 m형."
schema XAm(pr f: @111, pr g: @112) {
	X(Af(f, g)) |- id(A(X(f), X(g)))[
		NO_to_AN[mp[
			contrapose_u[ON_to_NA_V(f, g)][X(Af(f, g))],
			contrapose[VO(Nf(f), Nf(g))[]]
		]]
	]
}

schema XA(pr f, pr g) {
	|- cpn[XAm(f, g)]
}

schema X2A(pr2 f, pr2 g) {
	|- I(
		X2((cls x, cls y) => {A(f(x, y), g(x, y))}),
		A(X2(f), X2(g))
	)
}

schema AeX1(pr f, pr g) {
	tt.IApqp(X(f), X(g))
	~ XA(f, g)
	~ syll(
		X(Af(f, g)),
		A(X(f), X(g)),
		X(f)
	)
}

schema AeX2(pr f, pr g) {
	tt.IApqq(X(f), X(g))
	~ XA(f, g)
	~ syll(
		X(Af(f, g)),
		A(X(f), X(g)),
		X(g)
	)
}

schema AeX2_1(pr2 f, pr2 g) {
	tt.IApqp(X2(f), X2(g))
	~ X2A(f, g)
	~ syll(
		X2((cls x, cls y) => {A(f(x, y), g(x, y))}),
		A(X2(f), X2(g)),
		X2(f)
	)
}

schema AeX2_2(pr2 f, pr2 g) {
	tt.IApqq(X2(f), X2(g))
	~ X2A(f, g)
	~ syll(
		X2((cls x, cls y) => {A(f(x, y), g(x, y))}),
		A(X2(f), X2(g)),
		X2(g)
	)
}

schema mpVE(pr f, pr g) {
	Ee1V(f, g) ~ mpV(f, g)
}

############################
######## SET THEORY ########
############################

"집합론에서 정의하는 in 연산자."
$!<prec=450>#1<<\in>>#2$
st in(cls x, cls y);

"not in 연산자."
$!<prec=450>#1<<\notin>>#2$
st Nin(cls x, cls y) {
	N(in(x, y))
}

"[$\subseteq]."
$!<prec=350>#1<<\subseteq>>#2$
st subseteq(cls x, cls y) {
	V((cls z) => {
		I(
			in(z, x),
			in(z, y)
		)
	})
}

"[$=] 연산자. [$\in]에 의존한다."
$!<prec=350>#1<<=>>#2$
st eq(cls x, cls y) {
	A(
		V((cls z) => {
			E(in(z, x), in(z, y))
		}),
		V((cls w) => {
			E(in(x, w), in(y, w))
		})
	)
}

"어떤 class 내에서의 forall."
$!<prec=249><<\forall>>_{\in #1}#2$
st Vin(cls a, pr f) {
	V((cls z) => {
		I(
			in(z, a),
			f(z)
		)
	})
}

schema Vin_subset(cls a: @12, cls b: @11, pr f: @22) {
	id(subseteq(a, b)) ~
	id(Vin(b, f)) ~
	syllV(
		(cls z) => {in(z, a)},
		(cls z) => {in(z, b)},
		f
	) ~ id(Vin(a, f))
}

schema VVin_m(cls a, pr2 f) {
	id(V((cls z) => {
		Vin(a, (cls w) => {f(z, w)})
	})) ~
	VVm((cls z, cls w) => {
		I(in(w, a), f(z, w))
	}) ~ VI_Vi_V2_Vi_VI_m(
		(cls y) => {in(y, a)},
		(cls y, cls x) => {f(x, y)}
	) ~ id(Vin(a, (cls w) => {
		V((cls z) => {f(z, w)})
	}))
}

"V와 Vin은 순서를 바꿀 수 있다."
schema VVin(cls a, pr2 f) {
	cp[VVin_m(a, f)]
}

"어떤 class 내에서의 exists. Vin과 달리 and로 연결된다."
$!<prec=249><<\exists>>_{#1}#2$
st Xin(cls a, pr f) {
	X((cls z) => {
		A(
			in(z, a),
			f(z)
		)
	})
}

"어떤 class가 집합이라는 것. 어떤 class의 원소면 된다."
$\left(<<\mathop\mathrm{set}>> #1\right)$
st set(cls x) {
	X((cls y) => {
		in(x, y)
	})
}

schema set_Xi(cls x, cls y) {
	Xi((cls y) => { in(x, y) }, y)
	~ id(set(x))
}

schema set_Xi_A(cls x, cls y, cls z) {
	Ae1(in(z, x), in(z, y)) ~
	set_Xi(z, x)
}

schema set_Xi_O(cls x, cls y, cls z) {
	cp[set_Xi(z, x)]
	~ cp[set_Xi(z, y)]
	~ Oe(in(z, x), in(z, y), set(z))
}

schema eq_Ae1(cls x, cls y) {
	id(eq(x, y))
	~ Ae1(
		V((cls z) => { E(in(z, x), in(z, y)) }),
		V((cls w) => { E(in(x, w), in(y, w)) })
	)
}

schema eq_Ae1_Ve(cls x, cls y, cls z) {
	eq_Ae1(x, y)
	~ Ve((cls z) => {
		E(in(z, x), in(z, y))
	}, z)
}

schema eq_Ae1_Ve_Ee1(cls x, cls y, cls z) {
	eq_Ae1_Ve(x, y, z)
	~ Ee1(in(z, x), in(z, y))
}

schema eq_Ae2(cls x, cls y) {
	id(eq(x, y)) ~
	Ae2(
		V((cls z) => { E(in(z, x), in(z, y)) }),
		V((cls w) => { E(in(x, w), in(y, w)) })
	)
}

schema eq_Ae2_Ve(cls x, cls y, cls z) {
	eq_Ae2(x, y)
	~ Ve((cls z) => {
		E(in(x, z), in(y, z))
	}, z)
}

schema eq_Ae2_Ve_Ee1(cls x, cls y, cls z) {
	eq_Ae2_Ve(x, y, z)
	~ Ee1(in(x, z), in(y, z))
}

schema eq_Ae2_Ve_Ee1_c(cls x, cls y, cls z) {
	cp[eq_Ae2_Ve_Ee1(x, y, z)]
}

schema swapV_1(pr f, pr g, pr h, cls w) {
	swap_c(f(w), g(w), h(w))
}

schema swapV_c(pr f, pr g, pr h) {
	Viu((cls w) => {
		I(I(f(w), I(g(w), h(w))), I(g(w), I(f(w), h(w))))
	})[(cls w) => {swapV_1(f, g, h, w)}]
	~ VIm(
		(cls w) => {I(f(w), I(g(w), h(w)))},
		(cls w) => {I(g(w), I(f(w), h(w)))}
	)
}

schema swapV(pr f, pr g, pr h) {
	mpu[swapV_c(f, g, h)]
}

schema swapV2_1(pr2 f, pr2 g, pr2 h, cls z) {
	swapV_c(
		(cls w) => {f(z, w)},
		(cls w) => {g(z, w)},
		(cls w) => {h(z, w)}
	)
}

schema swapV2_c(pr2 f, pr2 g, pr2 h) {
	Viu((cls z) => {
		I(
			V((cls w) => {I(f(z, w), I(g(z, w), h(z, w)))}),
			V((cls w) => {I(g(z, w), I(f(z, w), h(z, w)))})
		)
	})[(cls z) => {swapV2_1(f, g, h, z)}]
	~ VIm(
		(cls z) => {
			V((cls w) => {
				I(f(z, w), I(g(z, w), h(z, w)))
			})
		},
		(cls z) => {
			V((cls w) => {
				I(g(z, w), I(f(z, w), h(z, w)))
			})
		}
	)
	~ id(I(
		V2((cls z, cls w) => {
			I(f(z, w), I(g(z, w), h(z, w)))
		}),
		V2((cls z, cls w) => {
			I(g(z, w), I(f(z, w), h(z, w)))
		})
	))
}

schema swapV2(pr2 f, pr2 g, pr2 h) {
	mpu[swapV2_c(f, g, h)]
}

schema eq_Ae2_Ve_Ee1_c_swap(cls x, cls y, cls z) {
	eq_Ae2_Ve_Ee1_c(x, y, z)
	~ swap(
		eq(x, y),
		in(x, z),
		in(y, z)
	)
}

schema eq_reflexive_tmp1(cls x, cls z) {
	tt.Epp(in(z, x))
}

schema eq_reflexive_tmp2(cls x, cls w) {
	tt.Epp(in(x, w))
}

schema eq_reflexive(cls x) {
	Viu((cls z) => {
		E(in(z, x), in(z, x))
	})[(cls z) => {eq_reflexive_tmp1(x, z)}]
	~ Viu((cls w) => {
		E(in(x, w), in(x, w))
	})[(cls w) => {eq_reflexive_tmp2(x, w)}]
	~ Ai(
		V((cls z) => { E(in(z, x), in(z, x)) }),
		V((cls w) => { E(in(x, w), in(x, w)) })
	)
	~ id(eq(x, x))
}

schema eq_symmetric(cls x, cls y) {
	id(eq(x, y)) ~
	Ae1(
		V((cls z) => { E(in(z, x), in(z, y)) }),
		V((cls w) => { E(in(x, w), in(y, w)) })
	) ~ IVEpqVEqpfm(
		(cls z) => { in(z, x) },
		(cls z) => { in(z, y) }
	) ~ Ae2(
		V((cls z) => { E(in(z, x), in(z, y)) }),
		V((cls w) => { E(in(x, w), in(y, w)) })
	) ~ IVEpqVEqpfm(
		(cls w) => { in(x, w) },
		(cls w) => { in(y, w) }
	) ~ Ai(
		V((cls z) => { E(in(z, y), in(z, x)) }),
		V((cls w) => { E(in(y, w), in(x, w)) })
	)
	~ id(eq(y, x))
}

schema eq_transitive(cls x, cls y, cls z) {
	id(eq(y, z)) ~
	Ae1(
		V((cls w) => {E(in(w, y), in(w, z))}),
		V((cls w) => {E(in(y, w), in(z, w))})
	) ~
	Ae2(
		V((cls w) => {E(in(w, y), in(w, z))}),
		V((cls w) => {E(in(y, w), in(z, w))})
	) ~
	id(eq(x, y)) ~
	Ae1(
		V((cls w) => {E(in(w, x), in(w, y))}),
		V((cls w) => {E(in(x, w), in(y, w))})
	) ~
	Ae2(
		V((cls w) => {E(in(w, x), in(w, y))}),
		V((cls w) => {E(in(x, w), in(y, w))})
	) ~
	syllVE(
		(cls w) => {in(w, x)},
		(cls w) => {in(w, y)},
		(cls w) => {in(w, z)}
	)
	~ syllVE(
		(cls w) => {in(x, w)},
		(cls w) => {in(y, w)},
		(cls w) => {in(z, w)}
	)
	~ Ai(
		V((cls w) => {E(in(w, x), in(w, z))}),
		V((cls w) => {E(in(x, w), in(z, w))})
	)
	~ id(eq(x, z))
}

schema eq_transitive_3(cls x, cls y, cls z) {
	eq_transitive(x, y, z)
	~ eq_symmetric(x, z)
}

schema eq_transitive_2(cls x, cls y, cls z) {
	eq_symmetric(z, y) ~
	eq_transitive(x, y, z)
}

schema eq_transitive_23(cls x, cls y, cls z) {
	eq_symmetric(z, y) ~
	eq_transitive(x, y, z)
	~ eq_symmetric(x, z)
}

schema eq_transitive_1(cls x, cls y, cls z) {
	eq_symmetric(y, x)
	~ eq_transitive(x, y, z)
}

schema eq_transitive_13(cls x, cls y, cls z) {
	eq_symmetric(y, x)
	~ eq_transitive(x, y, z)
	~ eq_symmetric(x, z)
}

"uniqueness quantification."
$!<prec=249><<\exists!>>#1$
st Q(pr f) {
	A(
		X(f),
		V2((cls x, cls y) => {
			I(
				A(f(x), f(y)),
				eq(x, y)
			)
		})
	)
}

schema IQX(pr f: @11) {
	Q(f) |- Ae1[Q(f)]
}

schema set_is_set_1(cls x, cls y) {
	id(set(x)) ~
	eq_Ae2(x, y)
	~ mpXE(
		(cls w) => { in(x, w) },
		(cls w) => { in(y, w) }
	)
	~ id(set(y))
}

schema set_is_set_2(cls x, cls y) {
	eq_symmetric(y, x) ~
	set_is_set_1(x, y)
}

schema subseteq_subseteq(cls x, cls y, cls z) {
	id(subseteq(x, y)) ~
	id(subseteq(y, z)) ~
	syllV(
		(cls w) => { in(w, x) },
		(cls w) => { in(w, y) },
		(cls w) => { in(w, z) }
	)
	~ id(subseteq(x, z))
}

"axiom of extensionality."
axiomatic schema extensional(cls x, cls y) {
	|- I(
		V((cls z) => {
			E(
				in(z, x),
				in(z, y)
			)
		}),
		eq(x, y)
	)
}

schema extensional_m(cls x, cls y) {
	mpu[extensional(x, y)]
}

schema eq_simple(cls x, cls y) {
	cp[eq_Ae1(x, y)]
	~ extensional(x, y)
	~ Ei(
		eq(x, y),
		V((cls z) => { E(in(z, x), in(z, y)) })
	)
}

schema eq_then_subseteq_m(cls x, cls y) {
	eq_simple(x, y)
	~ mpE(
		eq(x, y),
		V((cls z) => { E(in(z, x), in(z, y)) })
	)
	~ Ee1V(
		(cls z) => { in(z, x) },
		(cls z) => { in(z, y) }
	)
	~ id(subseteq(x, y))
}

schema eq_then_subseteq(cls x, cls y) {
	cp[eq_then_subseteq_m(x, y)]
}

schema eq_subseteq(cls x, cls y, cls z) {
	eq_then_subseteq_m(x, y)
	~ subseteq_subseteq(x, y, z)
}

schema subseteq_eq(cls x, cls y, cls z) {
	eq_then_subseteq_m(y, z)
	~ subseteq_subseteq(x, y, z)
}

"술어를 만족하는 set들의 class를 만든다. 일반적으로는 [$\{z: f(z)\}]라고 쓰는 것."
$\left\{<<:>>#1\right\}$
cls setbuilder(pr f);

"setbuilder의 defining property. f를 만족하는 임의의 [**집합]의 class를 만들게 해 준다."
axiomatic schema setbuilder_def(pr f) {
	|- V((cls w) => {
		E(
			in(w, setbuilder(f)),
			A(set(w), f(w))
		)
	})
}

schema setbuilder_def_Ve(pr f, cls z) {
	Veu((cls w) => {
		E(in(w, setbuilder(f)), A(set(w), f(w)))
	}, z)[setbuilder_def(f)]
}

schema setbuilder_def_Ve_Ee(pr f, cls z) {
	setbuilder_def_Ve(f, z)
	~ mpu[tt.IEpAqrIpr(
		in(z, setbuilder(f)),
		set(z),
		f(z)
	)]
}

schema setbuilder_def_set(pr f, cls x) {
	I(f(x), set(x)) |-
		Ei[
			cpn[
				in(x, setbuilder(f)) |-
					Ae2[mp[
						in(x, setbuilder(f)),
						Ee1[Ve(?, x)[setbuilder_def(f)[]]]
					]]
			],
			cpn[
				f(x) |-
					mp[
						Ai[
							mp[f(x), I(f(x), set(x))],
							f(x)
						],
						Ee2[Ve(?, x)[setbuilder_def(f)[]]]
					]
			]
		]
}

"교집합."
$!<prec=300>#1<<\cap>>#2$
cls cap(cls x, cls y) {
	setbuilder((cls z) => {
		A(in(z, x), in(z, y))
	})
}

schema set_Xi_A_c(cls x, cls y, cls z) {
	cp[set_Xi_A(x, y, z)]
}

schema cap_def(cls x, cls y, cls z) {
	|- id(E(in(z, cap(x, y)), A(in(z, x), in(z, y))))[
		setbuilder_def_set((cls z) => {
			A(in(z, x), in(z, y))
		}, z)[set_Xi_A_c(x, y, z)[]]
	]
}

schema cap_def_vi(cls x, cls y) {
	|- Vi[(cls z) => { cap_def(x, y, z)[] }]
}

schema cap_commutative_1(cls x, cls y, cls z) {
	cap_def(x, y, z)
	~ tt.EApqAqp(in(z, x), in(z, y))
	~ cap_def(y, x, z)
	~ IEpqEqpm(
		in(z, cap(y, x)),
		A(in(z, y), in(z, x))
	)
	~ syllE4(
		in(z, cap(x, y)),
		A(in(z, x), in(z, y)),
		A(in(z, y), in(z, x)),
		in(z, cap(y, x))
	)
}

schema cap_commutative_2(cls x, cls y) {
	Viu((cls z) => {
		E(in(z, cap(x, y)), in(z, cap(y, x)))
	})[(cls z) => { cap_commutative_1(x, y, z) }]
	~ extensional_m(
		cap(x, y),
		cap(y, x)
	)
}

"합집합."
$!<prec=300>#1<<\cup>>#2$
cls cup(cls x, cls y) {
	setbuilder((cls z) => {
		O(in(z, x), in(z, y))
	})
}

schema set_Xi_O_c(cls x, cls y, cls z) {
	cp[set_Xi_O(x, y, z)]
}

schema cup_def(cls x, cls y, cls z) {
	|- id(E(in(z, cup(x, y)), O(in(z, x), in(z, y))))[
		setbuilder_def_set((cls z) => {
			O(in(z, x), in(z, y))
		}, z)[set_Xi_O_c(x, y, z)[]]
	]
}

schema cup_def_vi(cls x, cls y) {
	|- Vi[(cls z) => { cup_def(x, y, z)[] }]
}

"empty class."
$<<\varnothing>>$
cls emptyset() {
	setbuilder((cls z) => { F })
}

schema emptyset_vi() {
	setbuilder_def((cls z) => { F })
	~ Ee1V(
		(cls z) => { in(z, emptyset()) },
		(cls z) => { A(set(z), F) }
	)
	~ Viu((cls x) => {
		I(A(set(x), F), F)
	})[(cls x) => { tt.IApFF(set(x)) }]
	~ syllV(
		(cls z) => { in(z, emptyset()) },
		(cls z) => { A(set(z), F) },
		(cls z) => { F }
	)
	~ Viu((cls z) => {
		I(I(in(z, emptyset()), F), N(in(z, emptyset())))
	})[(cls z) => { cp[Ni(in(z, emptyset()))] }]
	~ mpV(
		(cls z) => { I(in(z, emptyset()), F) },
		(cls z) => { Nin(z, emptyset()) }
	)
}

"emptyset의 defining property."
schema emptyset_def(cls z) {
	Veu((cls z) => {
		Nin(z, emptyset())
	}, z)[emptyset_vi()]
}

"universal class."
$<<V>>$
cls universe() {
	setbuilder((cls z) => { T })
}

schema setbuilder_is_setbuilder(pr f, cls x) {
	eq_Ae1(x, setbuilder(f))
	~ setbuilder_def(f)
	~ syllVE(
		(cls z) => { in(z, x) },
		(cls z) => { in(z, setbuilder(f)) },
		(cls z) => { A(set(z), f(z)) }
	)
}

"술어와 집합으로부터 술어를 만족하는 집합의 부분집합을 만든다.
일반적으로는 [$\{z \in x: f(z)\}]라고 쓰는 것인데 더미 변수를 없애버렸다."
$\left\{#1<<:>>#2\right\}$
cls subsetbuilder(cls x, pr f) {
	setbuilder((cls y) => {
		A(
			in(y, x),
			f(y)
		)
	})
}

"axiom schema of specification. 어떤 집합에서 임의 술어를 만족시키는 원소들의 class를 만들었을 때 이 class가 집합이라는 뜻이다."
axiomatic schema specify(pr f) {
	|-
	V((cls x) => {
		I(
			set(x),
			set(subsetbuilder(x, f))
		)
	})
}

schema specify_vem(pr f, cls x) {
	mpu[Veu((cls x) => {
		I(set(x), set(subsetbuilder(x, f)))
	}, x)[specify(f)]]
}

schema cap_is_set_1(cls x, cls y) {
	specify_vem((cls z) => { in(z, y) }, x)
	~ id(set(cap(x, y)))
}

schema cap_is_set_2(cls x, cls y) {
	specify_vem((cls z) => { in(z, x) }, y)
	~ cap_commutative_2(y, x)
	~ set_is_set_1(cap(y, x), cap(x, y))
}

schema subset_cap_is_subset(cls x, cls y) {
	id(subseteq(x, y)) ~
	mpu[Viu((cls z) => {
		I(I(in(z, x), in(z, y)), E(in(z, x), A(in(z, x), in(z, y))))
	})[(cls z) => {
		tt.IIpqEpApq(in(z, x), in(z, y))
	}]
	~VIm(
		(cls z) => { I(in(z, x), in(z, y)) },
		(cls z) => {
			E(
				in(z, x),
				A(in(z, x), in(z, y))
			)
		}
	)] ~
	cap_def_vi(x, y) ~ IVEpqVEqpfm(
		(cls z) => { in(z, cap(x, y)) },
		(cls z) => { A(in(z, x), in(z, y)) }
	) ~
	syllVE(
		(cls z) => { in(z, x) },
		(cls z) => { A(in(z, x), in(z, y)) },
		(cls z) => { in(z, cap(x, y)) }
	)
	~ extensional_m(x, cap(x, y))
}

schema subset_is_set(cls x, cls y) {
	subset_cap_is_subset(x, y)
	~ cap_is_set_2(x, y)
	~ set_is_set_2(cap(x, y), x)
}

schema subset_is_set_ae(cls x, cls y) {
	Ae1(set(y), subseteq(x, y))
	~ Ae2(set(y), subseteq(x, y))
	~ subset_is_set(x, y)
}

schema subset_is_set_ae_c(cls x, cls y) {
	cp[subset_is_set_ae(x, y)]
}

schema subset_is_set_ae_cvi(cls x) {
	Viu((cls y) => {
		I(A(set(y), subseteq(x, y)), set(x))
	})[(cls y) => { subset_is_set_ae_c(x, y) }]
}

"power class."
$<<\mathcal P>>(#1)$
cls power(cls x) {
	setbuilder((cls z) => {
		subseteq(z, x)
	})
}

schema IAEpAqrIAsrqIsEprmAi(st p, st q, st r, st s) {
	Ai(
		E(p, A(q, r)),
		I(A(s, r), q)
	) ~
	mpu[tt.IAEpAqrIAsrqIsEpr(p, q, r, s)]
}

schema power_def_1(cls x, cls y) {
	subset_is_set_ae_c(y, x)
	~ setbuilder_def_Ve((cls z) => {
		subseteq(z, x)
	}, y)
	~ IAEpAqrIAsrqIsEprmAi(
		in(y, power(x)),
		set(y),
		subseteq(y, x),
		set(x)
	)
}

"얘는 power_def보다 강력하다. 즉 power_def는 얘를
유도할 수 없다. 아마?"
schema power_def_Ve(cls x, cls y) {
	mpu[power_def_1(x, y)]
}

"생각해 보니 얘는 멱집합의 defining property라고 부를 만큼 강력하지 않다. 이름을 적당히 바꿔야 할지도 모른다."
schema power_def(cls x) {
	Vi_p(set(x)) ~
	mpu[Viu((cls y) => {
		I(set(x), E(in(y, power(x)), subseteq(y, x)))
	})[(cls y) => { power_def_1(x, y) }]
	~ VIm(
		(cls z) => { set(x) },
		(cls z) => {
			E(
				in(z, power(x)),
				subseteq(z, x)
			)
		}
	)]
}

"x가 집합일 때, x와 같은 것은 x의 power class에 속한다."
schema self_in_power(cls x, cls z) {
	eq_then_subseteq(z, x)
	~ power_def_Ve(x, z)
	~ Ee2(
		in(z, power(x)),
		subseteq(z, x)
	)
	~ syll(
		eq(z, x),
		subseteq(z, x),
		in(z, power(x))
	)
}

schema self_in_power_Vi_1(cls x, cls z) {
	cp[self_in_power(x, z)]
}

schema self_in_power_Vi(cls x) {
	Vi_p(set(x)) ~
	mpu[Viu((cls z) => {
		I(set(x), I(eq(z, x), in(z, power(x))))
	})[(cls z) => { self_in_power_Vi_1(x, z) }]
	~ VIm(
		(cls z) => {set(x)},
		(cls z) => {I(
			eq(z, x),
			in(z, power(x))
		)}
	)]
}

"singleton class."
$\left\{<<=>>#1\right\}$
cls singleton(cls x) {
	setbuilder((cls z) => {
		eq(z, x)
	})
}

schema singleton_subseteq_power_1(cls x, cls y) {
	setbuilder_def_Ve_Ee((cls z) => {eq(z, x)}, y) ~
	eq_then_subseteq(y, x) ~
	power_def_Ve(x, y)
	~ Ee2(
		in(y, power(x)),
		subseteq(y, x)
	)
	~ syll4(
		in(y, singleton(x)),
		eq(y, x),
		subseteq(y, x),
		in(y, power(x))
	)
}

schema singleton_subseteq_power_2(cls x, cls y) {
	cp[singleton_subseteq_power_1(x, y)]
}

schema singleton_subseteq_power(cls x) {
	Vi_p(set(x)) ~
	mpu[Viu((cls y) => {
		I(set(x), I(in(y, singleton(x)), in(y, power(x))))
	})[(cls y) => { singleton_subseteq_power_2(x, y) }]
	~ VIm(
		(cls y) => {set(x)},
		(cls y) => {
			I(
				in(y, singleton(x)),
				in(y, power(x))
			)
		}
	)]
	~ id(
		subseteq(singleton(x), power(x))
	)
}

"axiom of power set."
axiomatic schema ax_power() {
	|- V((cls x) => {
		I(
			set(x),
			X((cls y) => {
				A(
					set(y),
					V((cls z) => {
						I(subseteq(z, x), in(z, y))
					})
				)
			})
		)
	})
}

schema ax_power_vem(cls x) {
	mpu[Veu((cls x) => {
		I(set(x), X((cls y) => {
			A(set(y), V((cls z) => {
				I(subseteq(z, x), in(z, y))
			}))
		}))
	}, x)[ax_power()]]
}

schema power_is_set_1(cls x, cls y) {
	power_def(x)
	~ Ee1V(
		(cls z) => { in(z, power(x)) },
		(cls z) => { subseteq(z, x) }
	)
	~ syllV(
		(cls z) => { in(z, power(x)) },
		(cls z) => { subseteq(z, x) },
		(cls z) => { in(z, y) }
	)
	~ id(subseteq(power(x), y))
}

schema power_is_set_2(cls x, cls y) {
	cp[power_is_set_1(x, y)]
	~ mpu[tt.IIpqIArpArq(
		V((cls z) => {
			I(
				subseteq(z, x),
				in(z, y)
			)
		}),
		subseteq(power(x), y),
		set(y)
	)]
}

schema power_is_set_3(cls x, cls y) {
	cp[power_is_set_2(x, y)]
}

"멱집합은 집합이다."
schema power_is_set(cls x) {
	(ax_power_vem(x)
	~ Vi_p(set(x)) ~
	mpu[Viu((cls y) => {
		I(set(x), I(A(set(y), V((cls z) => {
			I(subseteq(z, x), in(z, y))
		})), A(set(y), subseteq(power(x), y))))
	})[(cls y) => { power_is_set_3(x, y) }]
	~ VIm(
		(cls y) => {set(x)},
		(cls y) => {
			I(
				A(
					set(y),
					V((cls z) => {
						I(
							subseteq(z, x),
							in(z, y)
						)
					})
				),
				A(
					set(y),
					subseteq(power(x), y)
				)
			)
		}
	)]
	~ mpX(
		(cls y) => {
			A(
				set(y),
				V((cls z) => {
					I(subseteq(z, x), in(z, y))
				})
			)
		},
		(cls y) => {
			A(set(y), subseteq(power(x), y))
		}
	))
	~ subset_is_set_ae_cvi(power(x))
	~ mpX_Xe_p(
		(cls y) => {
			A(set(y), subseteq(power(x), y))
		},
		set(power(x))
	)
}

"싱글턴은 집합이다."
schema singleton_is_set(cls x) {
	singleton_subseteq_power(x)
	~ power_is_set(x)
	~ subset_is_set(singleton(x), power(x))
}

"Axiom of infinity."
axiomatic schema infinity() {
	|- X((cls x) => {
		A(
			set(x),
			A(
				in(emptyset(), x),
				V((cls z) => {
					I(
						in(z ,x),
						in(cup(z, singleton(z)), x)
					)
				})
			)
		)
	})
}

###########################
######## RELATIONS ########
###########################

"순서쌍(ordered pair)."
$\left(#1<<,>>#2\right)$
cls v2(cls x, cls y);

axiomatic schema v2_eq_def(cls x, cls y, cls z, cls w) {
	|- E(
		eq(v2(x, y), v2(z, w)),
		A(eq(x, z), eq(y, w))
	)
}

axiomatic schema v2_set_def(cls x, cls y) {
	|- E(
		set(v2(x, y)),
		A(set(x), set(y))
	)
}

"곱집합(cartesian product)."
$!<prec=230>#1<<\times>>#2$
cls cartesian(cls x, cls y) {
	setbuilder((cls z) => {
		X2((cls a, cls b) => {
			A(
				eq(z, v2(a, b)),
				A(in(a, x), in(b, y))
			)
		})
	})
}

schema cartesian_def_(cls x, cls y, cls z) {
	setbuilder_def_set((cls z) => {
		X2((cls a, cls b) => {
			A(
				eq(z, v2(a, b)),
				A(in(a, x), in(b, y))
			)
		})
	}, z)
}

schema cartesian_def(cls x, cls y, cls z) {
	|- E(
		in(z, cartesian(x, y)),
		X2((cls a, cls b) => {
			A(
				eq(z, v2(a, b)),
				A(in(a, x), in(b, y))
			)
		})
	)
}

"어떤 class가 이항관계이다.

[$R]이 이항관계라 함은 [$R]의 임의 원소가 순서쌍이라는 뜻이다. 정의역(domain)과 치역(image)에 관한 정보는 담지 않도록 한다."
$\left(<<\mathop\mathrm{relation}>> #1\right)$
st rel(cls x) {
	Vin(x, (cls z) => {
		X2((cls a, cls b) => {
			eq(z, v2(a, b))
		})
	})
}

"이항관계의 정의역(domain)."
$!<prec=200><<\operatorname{dom}>>#1$
cls rel_dom(cls x) {
	setbuilder((cls a) => {
		X((cls b) => {
			in(v2(a, b), x)
		})
	})
}

"이항관계의 치역(image)."
$!<prec=200><<\operatorname{im}>>#1$
cls rel_im(cls x) {
	setbuilder((cls b) => {
		X((cls a) => {
			in(v2(a, b), x)
		})
	})
}

"이항관계의 역(inverse)."
$!<prec=190>{#1}^{<<-1>>}$
cls rel_inverse(cls x) {
	setbuilder((cls z) => {
		X2((cls a, cls b) => {
			A(
				eq(z, v2(b, a)),
				in(v2(a, b), x)
			)
		})
	})
}

"이항관계의 합성(composition)."
$!<prec=230>#1 <<\circ>> #2$
cls rel_composite(cls x, cls y) {
	setbuilder((cls z) => {
		X2((cls a, cls c) => {
			A(
				eq(z, v2(a, c)),
				X((cls b) => {
					A(
						in(v2(a, b), y),
						in(v2(b, c), x)
					)
				})
			)
		})
	})
}

"곱집합은 이항관계이다."
schema cartesian_is_rel(cls x, cls y) {
	Viu((cls z) => {
		I(
			in(z, cartesian(x, y)),
			X2((cls a, cls b) => {
				eq(z, v2(a, b))
			})
		)
	})[(cls z) => {
		cp[
			id(in(z, cartesian(x, y)))
			~ mpu[setbuilder_def_Ve_Ee((cls z) => {
				X2((cls a, cls b) => {
					A(
						eq(z, v2(a, b)),
						A(in(a, x), in(b, y))
					)
				})
			}, z)]
			~ mpu[AeX2_1(
				(cls a, cls b) => {eq(z, v2(a, b))},
				(cls a, cls b) => {A(in(a, x), in(b, y))}
			)]
		]
	}]
	~ id(rel(cartesian(x, y)))
}

schema rel_subset_is_rel(cls x: @11, cls y: @12) {
	(subseteq(x, y), rel(y) |- Vin_subset(x, y, (cls z) => {
		X2((cls a, cls b) => {
			eq(z, v2(a, b))
		})
	})[subseteq(x, y), rel(y)]) ~ id(rel(x))
}

schema rel_V_1_1(cls x, cls z, cls a, cls b) {
	eq_Ae2_Ve_Ee1_c_swap(z, v2(a, b), x)
}

"이항관계를 위한 V.

[$R]이 이항관계일 때 임의의 [$(a, b)\in R]에 대해 [$f(a, b)]이면, 임의의 [$x\in R]에 대해 [$fx]이다."
schema rel_V(pr f, cls x) {
	rel(x) |- I(
		V2((cls a, cls b) => {
			I(
				in(v2(a, b), x),
				f(v2(a, b))
			)
		}),
		Vin(x, f)
	)
}

schema rel_composite_associative(cls x, cls y, cls z) {
	rel(x), rel(y), rel(z) |- eq(
		rel_composite(rel_composite(x, y), z),
		rel_composite(x, rel_composite(y, z))
	)
}

"어떤 [$\langle f, A, B\rangle]가 함수이다.

[$f\subseteq A\times B]이고 임의의 [$x\in A]에 대해 [$(x, y)\in f]를 만족하는 유일한 [$y]가 존재한다는 뜻이다."
$\left(<<\mathop\mathrm{function}>> #1: #2 \to #3\right)$
st function(cls f, $A$ cls a, $B$ cls b) {
	A(
		subseteq(f, cartesian(a, b)),
		Vin(a, (cls x) => {
			Q((cls y) => {
				in(v2(x, y), f)
			})
		})
	)
}

schema fun_subseteq_cartesian(cls f: @11, $A$ cls a: @12, $B$ cls b: @13) {
	function(f, a, b) |- Ae1[function(f, a, b)]
}

schema fun_im_unique(cls f: @11, $A$ cls a: @12, $B$ cls b: @13) {
	function(f, a, b) |- Ae2[function(f, a, b)]
}

schema fun_im_exists(cls f: @11, $A$ cls a: @12, $B$ cls b: @13) {
	function(f, a, b) |- Vi[(cls x) => {
		cp[(
			in(x, a) |-
				IQX[mp[in(x, a), Ve(?, x)[fun_im_unique[function(f, a, b)]]]]
		)][]
	}] ~ id(Vin(a, (cls x) => {X((cls y) => {in(v2(x, y), f)})}))
}

schema fun_is_rel(cls f, $A$ cls a, $B$ cls b) {
	function(f, a, b) |- rel_subset_is_rel[
		fun_subseteq_cartesian(f, a, b)[function(f, a, b)],
		cartesian_is_rel(a, b)[]
	]
}

schema fun_dom(cls f, $A$ cls a, $B$ cls b) {
	function(f, a, b) |- eq(rel_dom(f), a)
}

"함수 호출."
$\left({#1}<<(>>#2)\right)$
cls fcall(cls f, cls x);

"fcall의 defining property.

[$f(x)]는 [$\langle f, A, B\rangle]이 함수이고 [$x\in A]일 때만 정의되며, 이때 [$f(x) = y]는 [$(x, y)\in f]와 동치라는 뜻이다."
axiomatic schema fcall_def(cls f, $A$ cls a, $B$ cls b, cls x, cls y) {
	function(f, a, b), in(x, a) |- E(
		eq(fcall(f, x), y),
		in(v2(x, y), f)
	)
}
`