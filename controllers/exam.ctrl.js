const commonDb = require('../db/commondb.v2')

exports.test = () =>{
    let data = {
        examname:"111",
        question:[
            {
                neirong:"lbqsb",
                answer:"1"
            },
            {
                neirong:"lbq is not sb",
                answer:"0"
            }
        ]
    }

    let exam = {}
    exam.examname = data.examname
    let examid =  commonDb.insert(exam, "exam")
    let question = data.question

    for (let i = 0; i < question.length; i++) {
        let questionItem = question[i]
        questionItem.examid = examid

        commonDb.insert(questionItem, "question ")
    }

}