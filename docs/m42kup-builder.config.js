var m42kup = require('m42kup'),
	hljs = require('highlight.js'),
	katex = require('katex');

m42kup.set({hljs, katex});

module.exports = {
	name: 'math-o-matic 설명서',
	src: 'src',
	dst: 'build',
	render: text => m42kup.render(text),
	list: [
		{
			name: '코드를 작성하는 법',
			file: 'code'
		},
		{
			name: '문법',
			dir: 'syntax',
			list: [
				{
					name: 'import',
					file: 'import'
				}
			]
		},
		{
			name: '현재의 공리계',
			dir: 'current-axiomatic-system',
			list: [
				{
					name: '대응 관계',
					file: 'counterparts'
				}
			]
		},
		{
			name: '개발자를 위한 명세',
			dir: 'dev',
			list: [
				{
					name: '우선순위',
					file: 'precedence'
				}
			]
		}
		
	]
};