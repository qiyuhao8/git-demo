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