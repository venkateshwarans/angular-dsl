import { Component } from '@angular/core';
import * as jsonLogic from 'v-jsonlogic';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  questionId = 'do_1';
  response1 = '';
  responseVariable = 'response1';
  secondQuestionId = 'do_2';
  targetOption;
  secondTargetOption;
  condition;
  secondCondition;
  rule;
  secondRule: {};
  firstResult;
  secondResult;
  firstData: {};
  secondData: {};
  thirdQuestionId = 'do_3';
  thirdTargetOption;
  thirdCondition;
  thirdRule: {};
  thirdResult: {};
  thirdData: {};
  // {{configService.labelConfig?.categoryLabels?.[template] || template}}
  configService = {
    labelConfig: {
      categoryLabels: {
        MMCQ: 'welcome'
      }
    }
  };
  template = 'MMCQ';

  conditionHandler(e) {
    this.condition = e.target.value;
  }

  optionHandler(e) {
    this.targetOption = e.target.value;
  }

  buildCondition() {
    console.log(this.targetOption, this.condition);

    const rule = {
      and: [
        {
          [this.condition]: [
            {
              var: `${this.questionId}.${this.responseVariable}`,
              type: 'responseDeclaration'
            },
            this.targetOption
          ]
        }
      ]
    };
    console.log(rule);
    this.rule = rule;
  }

  userResponseHandler(e) {
    this.firstData = {
      [this.questionId]: {
        [this.responseVariable] : e.value
      }
    };
    this.firstResult = jsonLogic.apply(this.rule, this.firstData);
  }

  responseTwoHandler(e) {
    this.secondData = {
      [this.secondQuestionId]: {
        [this.responseVariable]: {
          option: {
            value: _.map(e.source.selectedOptions.selected, 'value')
          }
        }
      }
    };

    this.secondResult = jsonLogic.apply(this.secondRule, this.secondData);
  }

  secondConditionHandler(e) {
    this.secondCondition = e.target.value;
  }

  secondOptionHandler(e) {
    this.secondTargetOption = e.value;
  }

  buildSecondCondition() {
    let rule = {};
    if (this.secondCondition === 'eq') {
      // if (_.isArray(this.secondTargetOption)) {
      //   const combinations = this.combine(this.secondTargetOption, 0);
      //   const subRule = _.map(combinations, combination => {
      //     return {
      //         exists: [
      //           {
      //             var: `${this.secondQuestionId}.${this.responseVariable}`,
      //           },
      //           combination
      //         ]
      //       };
      //   });
      //   rule  = {
      //     or: [
      //       ...subRule
      //     ]
      //   };
      // }

      rule = {
        or: [
          {
            exists: [
              {
                var: `${this.secondQuestionId}.${this.responseVariable}.option.value`,
                type: 'responseDeclaration',

              },
              this.secondTargetOption
            ]
          }
        ]
      };
      console.log(rule);
      this.secondRule = rule;
    } else if (this.secondCondition === 'ne') {
      rule  = {
       and: [
         {
          not_exists: [
             {
               var: `${this.secondQuestionId}.${this.responseVariable}.option.value`,
               type: 'responseDeclaration'
             },
             this.secondTargetOption
           ]
         }
       ]
     };
      console.log(rule);
      this.secondRule = rule;
   }
  }

  thirdConditionHandler(e) {
    this.thirdCondition = e.target.value;
  }

  thirdOptionHandler(e) {
    this.thirdTargetOption = e.value;
  }

  responseThreeHandler(e) {
    const score = _.reduce(e.source.selectedOptions.selected, (sum, n) => {
      return sum + n.value;
    }, 0);
    this.thirdData = {
      ['OUTCOME']: {
        ['SCORE']: score
      }
    };

    this.thirdResult  = jsonLogic.apply(this.thirdRule, this.thirdData);
  }

  buildThirdCondition() {
    let rule = {};
    rule = {
      and: [
        {
          [this.thirdCondition]: [
            {
              var: `OUTCOME.SCORE`
            },
            this.thirdTargetOption
          ]
        }
      ]
    };
    this.thirdRule = rule;

  }

  combine(a, min) {
      const fn = (n, src, got, all) => {
          if (n === 0) {
              if (got.length > 0) {
                  all[all.length] = got;
              }
              return;
          }
          for (let j = 0; j < src.length; j++) {
              fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
          }
          return;
      };
      const all = [];
      for (let i = min; i < a.length; i++) {
          fn(i, a, [], all);
      }
      all.push(a);
      return all;
  }
}
