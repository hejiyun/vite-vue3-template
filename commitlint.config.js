module.exports = {
  extends: [
    '@commitlint/config-conventional', // scoped packages are not prefixed
  ],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'fix', 'docs', 'style', 'refactor', 'perf', 'ci', 'chore'],
      // 这个集合对应自定义提交内容里cz-configrc.js 中types集合的value（需要被包含在这个集合里的才行）
    ],
    'type-case': [2, 'always', ['lower-case', 'upper-case']],
    'scope-case': [0, 'never'],
    'subject-case': [0, 'never'],
    'scope-empty': [2, 'never'],
  },
}
