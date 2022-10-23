# 简介

commit message最好应该符合代码规范，目前最常用的代码规范为[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)。

```
# head: <type>(<scope>): <subject>
# - type: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
# - scope: can be empty (eg. if the change is a global or difficult to assign to a single component), e.g: route, component, utils, build...
# - subject: start with verb (such as 'change'), 50-character line
#
# body: 72-character wrapped. Multiple lines separated by “-”, This should answer:
# * Why was this change necessary?
# * How does it address the problem?
# * Are there any side effects?
#
# footer: 
# - Include a link to the ticket, if any.
# - BREAKING CHANGE
#
# e.g:
# <type>(<scope>): <subject>
# <BLANK LINE>
# <body>
# <BLANK LINE>
# <footer>
# 
# types:
#
# feat:     A new feature 
# fix:      A bug fix 
# docs:     Documentation only changes 
# style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) 
# refactor: A code change that neither fixes a bug nor adds a feature 
# perf:     A code change that improves performance 
# test:     Adding missing tests or correcting existing tests
# build:    Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm) 
# ci:       Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) 
# chore:    Other changes that don't modify src or test files 
# revert:   Reverts a previous commit
```

# 相关工具

## Commitizen

交互式自动生成commit message的工具，需要Adapter来生成模板。

全局安装：

```bash
npm install -g commitizen
npx cz
```

Commitizen configs可以放在 `.czrc` 或者 `.cz.json`文件中，样例如下：

```json
{
  "path": "./node_modules/cz-conventional-changelog-feiyun",
  "disableScopeLowerCase": false,
  "disableSubjectLowerCase": false,
  "maxHeaderWidth": 100,
  "maxLineWidth": 100,
  "defaultType": "",
  "defaultScope": "",
  "defaultSubject": "",
  "defaultBody": "",
  "types": {
    "feat": {
      "description": "增加新功能"
    },
    "fix": {
      "description": "修复bug"
    },
    "docs": {
      "description": "增加或修改文档"
    },
    "refactor": {
      "description": "代码重构"
    },
    "test": {
      "description": "增加测试"
    },
    "chore": {
      "description": "杂项"
    },
    "perf": {
      "description": "改善性能"
    },
    "style": {
      "description": "不改变代码含义的情况下改变代码格式"
    },
    "build": {
      "description": "构建系统或者包依赖更新"
    },
    "ci": {
      "description": "CI,CD配置和脚本文件更新"
    },
    "revert": {
      "description": "版本回退"
    }
  }
}
```

package.json需要配置

```json
"devDependencies": {
    ...
    "cz-conventional-changelog-feiyun": "git+https://github.com/qiyuhao8/cz-conventional-changelog-feiyun.git#62ef2739c73130c67f8b48b008300d0c9daf5bda",
   ...
  },
```

其中 cz-conventional-changelog-feiyun 是Adapter，fork自cz-conventional-changelog。

如果不需要自定义message结构的话，使用 cz-conventional-changelog就行了。

如果需要自定义message结构。fork cz-conventional-changelog 之后修改engine.js 即可。

## Commitlint

用于检查commit message是否复合规范，可以配合Husky在代码提交前自动校验，也可以配合@commitlint/cli做手动校验。

```
npm install --save-dev @commitlint/config-conventional @commitlint/cli
npm install husky --save-dev
npx husky install
npx husky add .husky/commit-msg  "npx --no -- commitlint --edit ${1}"
```

配置文件commitlint.config.js

```js
/**
 * @type {import('eslint').Linter.Config}
 */

module.exports = {
    parserPreset: {
        parserOpts: {
            headerPattern: /^(?:#([0-9]*)_)?(\w+)(?:\((\w+)\))?:\s(.+)/,
            headerCorrespondence: ["feiyunMessionID", "type", "scope", "subject"],
        },
    },
    plugins: [
        {
            rules: { "header-match-team-pattern": (parsed) => { 
                const { feiyunMessionID, type, scope, subject } = parsed;
                if (feiyunMessionID === null && type === null && scope === null && subject === null) {
                    return [
                      false,
                      "Header must be in format '#xxx_type(scope): subject'",
                    ];
                  }
                  return [true, ""];
            } }
        }
    ],
    rules: {
        "header-match-team-pattern": [2, "always"]
    },
    extends: ['@commitlint/config-conventional']
};
```

这里为飞云加了适配，其他要求都根据@commitlint/config-conventional 来。

## Conventional Changelog

[Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog)是为了自动生成 `CHANGELOG.md`。原生的 Conventional Changelog 只支持几个预先设定的模板，不能支持自定义格式，所以这里还需要[conventional-changelog-custom-config](https://www.npmjs.com/package/conventional-changelog-custom-config)来让我们的自定模板生效。配置可以参考conventional-changelog-custom-config的官网。
