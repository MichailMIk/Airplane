let constData = {
    nRow: 9,
    nCol: 6,

    nPreferTea: 27,
    nPreferCoffee: 9,
    nPreferWater: 18,

    prizeTea: 2,
    prizeCoffee: 4,
    prizeTeaCoffee: 1,
}

let game = {
    givenToLetter: {Tea: 'T', Coffee: 'C', Water: 'W'},

    calcPrizeMax () {
        this.prizeMax = this.prize
        for (let ind = this.activeRow * this.nCol; ind < this.nSize; ind++) {
            if (!this.seats[ind].served && this.seats[ind].given !== 'Water')
                this.prizeMax += (this.seats[ind].given === 'Tea') ? this.prizeTea : this.prizeCoffee
        }
    },
    randomString (length) {
        const chars = 'abcdef0123456789'
        let charsLen = chars.length
        let result = ''
        for (let i = 0; i < length; i++)
            result += chars.charAt(Math.random()*charsLen)
        return result
    },
    onClickHint () {
        game.hintChecked = !game.hintChecked
        game.rerender ()
    },

    isPass (col, nCol) {
        const passes = [
            [1, 1],     //nCol = 1
            [1, 1],     //nCol = 0
            [1, 1],     //nCol = 2
            [1, 1],     //nCol = 3
            [2, 2],     //nCol = 4
            [3, 3],     //nCol = 5
            [3, 3],     //nCol = 6
            [2, 5],     //nCol = 7
            [2, 6],     //nCol = 8
            [3, 6],     //nCol = 9
            [3, 7],     //nCol = 10
            [3, 8],     //nCol = 11
            [3, 9],     //nCol = 12
        ]
        if (passes[nCol][0] === col ||
            passes[nCol][1] === col) return true
        else return false
    },
    isSeatEnabled  (row, col)  {
        let ind = this.getIndex(row, col)
        if (this.gameEnded || this.seats[ind].served) return false

/*
        //Вариант 1: второй ряд открываем, когда в первом больше половины мест обслужены
        return (row === this.activeRow) ||
              (row === (this.activeRow+1) && this.nServedInRow >= this.nCol/2)
*/
        //Вариант 2: второй ряд открываем, когда открыт хотя бы один в текущем ряду
        return (row === this.activeRow) ||
               (row === (this.activeRow+1) && this.nServedInRow >= 1)
    },

    seatOffer (ind) {
        let row = game.getRow (ind)
        let col = game.getCol (ind)
        let seat = game.seats[ind]

        if (seat.served || !game.isSeatEnabled (row, col)) {
            return
        }

        seat.served = true
        seat.isQuestionTea = game.isQuestionTea
        seat.isQuestionCoffee = game.isQuestionCoffee
        seat.isQuestionTeaCoffee = game.isQuestionTeaCoffee

        if (seat.given === 'Water')  game.prize = 0
        else if (seat.isQuestionTeaCoffee) game.prize += game.prizeTeaCoffee
        else if (seat.isQuestionTea && seat.given === 'Tea') game.prize += game.prizeTea
        else if (seat.isQuestionCoffee && seat.given === 'Coffee') game.prize += game.prizeCoffee
        else game.prize += 0    //not correct answer

        //Вычисляем новое значение activeRow и nServedInRow
        if (row === game.activeRow) {
            if (seat.given === 'Water' || game.nServedInRow === (game.nCol-1)) {
                game.activeRow++
                game.nServedInRow = 0
            }
            else {
                game.nServedInRow++
            }
        }
        else {  //row === (game.activeRow+1)
            if (seat.given === 'Water') {
                game.activeRow += 2
                game.nServedInRow = 0
            }
            else {
                game.activeRow += 1
                game.nServedInRow = 1
            }
        }

        game.nextServed = undefined
        game.calcPrizeMax ()

        if (game.activeRow === game.nRow) {
            game.onClickEndGame()
            game.onClickEndGame()   //!! Doubled call to changed hint in proper state
        }
        else
            game.rerender()
    },


    onClickTake (ind) {
        game.onClickEndGame()
    },

    onClickSeat (ind) {
        game.nextServed = ind
        game.rerender()
    },

    onClickNewGame() {
        let prizeTea = Number (this.prizeTeaStr)
        let prizeCoffee = Number (this.prizeCoffeeStr)
        let prizeTeaCoffee = Number (this.prizeTeaCoffeeStr)
        let nPreferTea = Number (this.nPreferTeaStr)
        let nPreferCoffee = Number (this.nPreferCoffeeStr)
        let nPreferWater = Number (this.nPreferWaterStr)
        let nRow = Number (this.nRowStr)
        let nCol = Number (this.nColStr)

        //Error analizing
        if (nPreferTea + nPreferCoffee + nPreferWater !== nRow * nCol) {
            alert ('Sum of prefers must be equal number of seats')
            return
        }
        if (nCol > 12) {alert ('Number of seats in row is too large'); return}
        if (nRow > 100)
        {alert ('Number of rows is too large'); return}
        if (nCol <=0 || nRow <= 0) {alert ('The parameter must be positive'); return}
        if (nCol <=0 || nRow <= 0) {alert ('The parameter must be positive'); return}

/*
        //Вариант запрета соседей-Water
        const maxWaterInRow = [
            0,
            1,  //for 1 seat in raw
            2,
            2,
            2,
            3,  //for 5 seat in raw
            4,  //for 6 seat in raw
            4,
            4,
            6,
            6,  //for 10 seat in raw
            7,  //for 11 seat in raw
            7,  //for 12 seat in raw
        ]
        if (nPreferWater >= maxWaterInRow[nCol]*nRow) {alert ('The number of Water Answers is too large'); return}
        //Вариант 2: в ряду 1-2 Water (равновероятно)
        let nWater = Math.floor(nRow*1.5)
        if (nPreferWater !== nWater) {alert (`The number of Water Answers must be equal ${nWater}`); return}
*/

        this.initialize ({
            nRow: nRow,
            nCol: nCol,

            nPreferTea: nPreferTea,
            nPreferCoffee: nPreferCoffee,
            nPreferWater: nPreferWater,

            prizeTea: prizeTea,
            prizeCoffee: prizeCoffee,
            prizeTeaCoffee: prizeTeaCoffee,
        })
        this.rerender ()
    },

    onClickEndGame () {
        // game.hintChecked = true
        game.gameEnded = true

        this.rerender ()
    },

    onClickQuestionTea () {
        this.isQuestionTea = true;
        this.isQuestionCoffee = false;
        this.isQuestionTeaCoffee = false;
        this.rerender ()
    },
    onClickQuestionCoffee () {
        this.isQuestionTea = false;
        this.isQuestionCoffee = true;
        this.isQuestionTeaCoffee = false;
        this.rerender ()
    },
    onClickQuestionTeaCoffee() {
        this.isQuestionTea = false;
        this.isQuestionCoffee = false;
        this.isQuestionTeaCoffee = true;
        this.rerender()
    },

    correctWater () {
        let nRow =  Number (this.nRowStr)
        this.nPreferWaterStr =  Math.floor(nRow*1.5)
    },
    onChangeRow(body)           {this.nRowStr = body; this.correctWater ();          this.rerender()},
    onChangeCol(body)           {this.nColStr = body;           this.rerender()},
    onChangePreferTea(body)     {this.nPreferTeaStr = body;     this.rerender()},
    onChangePreferCoffee(body)  {this.nPreferCoffeeStr = body;  this.rerender()},
    onChangePreferWater(body)   {this.nPreferWaterStr = body;  this.correctWater (); this.rerender()},
    onChangePrizeTea(body)      {this.prizeTeaStr = body;       this.rerender()},
    onChangePrizeCoffee(body)   {this.prizeCoffeeStr = body;    this.rerender()},
    onChangePrizeTeaCoffee(body){this.prizeTeaCoffeeStr = body; this.rerender()},

    create (rerender) {
        this.rerender = rerender
        this.initialize (constData)
    },

    initialize(data) {
        let nRow = data.nRow
        let nCol = data.nCol

        this.nRow = nRow
        this.nCol = nCol

        this.nPreferTea = data.nPreferTea
        this.nPreferCoffee = data.nPreferCoffee
        this.nPreferWater = data.nPreferWater

        this.prizeTea = data.prizeTea
        this.prizeCoffee = data.prizeCoffee
        this.prizeTeaCoffee = data.prizeTeaCoffee

        this.isQuestionTea = true
        this.isQuestionCoffee = false
        this.isQuestionTeaCoffee = false

        this.gameEnded = false
        this.hintChecked = false
        this.nSize = nRow * nCol
        this.nextServed = undefined
        this.prize = 0
        this.activeRow = 0
        this.nServedInRow = 0

        //for Param Dialog
        this.nRowStr = this.nRow
        this.nColStr = this.nCol

        this.nPreferTeaStr = this.nPreferTea
        this.nPreferCoffeeStr = this.nPreferCoffee
        this.nPreferWaterStr = this.nPreferWater

        this.prizeTeaStr = this.prizeTea
        this.prizeCoffeeStr = this.prizeCoffee
        this.prizeTeaCoffeeStr = this.prizeTeaCoffee
        //End Param Dialog

        //Calculate random value for 'given' property

/*
        //Вариант случайной выборки из массива prefer с ограничением:
        //в одном ряду равновероятно одна или две воды так, что в сумме они дадут nRow*1.5 воды
        //
        this.seats = []

        let prefer = []
        for (let i = 0; i < this.nPreferTea; i++)    prefer.push('Tea')
        for (let i = 0; i < this.nPreferCoffee; i++) prefer.push('Coffee')

        //0. Проверяем корректность данных
        //if (this.nPreferWater !== nRow*1.5) alert('Improper number of Water Answers')

        //1. Создаем массив one-two: сначала nRow/2 единиц, потом nRow/2 двоек
        let
            one_two = []
        for (let i = 0; i < Math.floor((nRow+1)/2); i++) one_two.push (1)   //(nRow+1) - for odd nRow
        for (let i = 0; i < Math.floor(nRow/2); i++) one_two.push (2)
        //2. Создаем массив one_two_rand - случайно перемешанный one_two
        let one_two_rand = []
        for (let i = 0; i < nRow; i++) {
            let ind = Math.floor(Math.random() * one_two.length)
            let val = one_two[ind]
            one_two_rand.push(val)
            one_two.splice(ind, 1)          //delete element from array
        }
        //3. Создаем массив preferRand - случайно перемешанный массив prefer с
        //требуемыми ограничениями
        //3.1. Заполняем ряды
        for (let j = 0; j < nRow; j++) {
            let rowRand = []
            //Сначала заполним места с Water
            for (let i = 0; i < one_two_rand[j]; i++) {
                let ind
                do {
                    ind = Math.floor(Math.random() * nCol)
                } while (rowRand[ind] !== undefined)
                rowRand[ind] = 'Water'
            }
            //Остальные места заполним из массива prefer
            let p = 0
            for (let i = one_two_rand[j]; i < nCol; i++) {
                let ind = Math.floor(Math.random() * prefer.length)
                let given = prefer[ind]
                prefer.splice(ind, 1)          //delete element from array

                while (rowRand[p] !== undefined) p++      //пропускаем уже заполненные места
                rowRand[p++] = given
            }
            //Создаем Seat в соответствии с данными из массива rowRand
            for (let i = 0; i < nCol; i++) {
                let seat = this.createSeat (j, i, rowRand[i])
                this.seats.push (seat)
            }
        }
*/

/*
        //Вариант случайной выборки из массива prefer с ограничением:
        //в одной секции кресел (между проходами) не допускаются 2 воды рядом.
        //
        this.seats = []

        let prefer = []
        for (let i = 0; i < this.nPreferTea; i++)    prefer.push('Tea')
        for (let i = 0; i < this.nPreferCoffee; i++) prefer.push('Coffee')
        for (let i = 0; i < this.nPreferWater; i++)  prefer.push('Water')

        const maxCount = 100
        while (true) {
            let preferRand = prefer.slice()
            this.seats = []
            let count
            for (let j = 0; j < nRow; j++) {
                let prev = false
                for (let i = 0; i < nCol; i++) {
                    let given, ind
                    count = 0
                    do {
                        ind = Math.floor(Math.random() * preferRand.length)
                        given = preferRand[ind]
                        count++
                        if (count === maxCount) break
                    } while (given === 'Water' && prev)
                    if (count === maxCount) break
                    preferRand.splice(ind, 1)          //delete element from array
                    if (given === 'Water') prev = true
                    else prev = false
                    if (this.isPass(i + 1, nCol)) prev = false

                    let seat = this.createSeat(j, i, given)
                    this.seats.push(seat)
                }
                if (count === maxCount) break
            }
            if (count !== maxCount) break
        }
*/

/*
        //Вавриант абсолютно случайной выборки из массива prefer[]
        //
        this.seats = []

        let prefer = []
        for (let i = 0; i < this.nPreferTea; i++)    prefer.push('Tea')
        for (let i = 0; i < this.nPreferCoffee; i++) prefer.push('Coffee')
        for (let i = 0; i < this.nPreferWater; i++)  prefer.push('Water')

        for (let j = 0; j < nRow; j++) {
            for (let i = 0; i < nCol; i++) {
                let ind = Math.floor(Math.random() * prefer.length)
                let given = prefer[ind]
                prefer.splice(ind, 1)          //delete element from array

                let seat = this.createSeat (j, i, given)
                this.seats.push (seat)
            }
        }
*/
        //Вавриант блока из 3-х рядов
        //
        const T = 0
        const C = 1
        const W = 2
        const preferInThreeRow = [
            [W,T,T,T,T,C],
            [W,W,T,T,T,C],
            [W,W,W,T,T,C]
        ]


        this.seats = []
        for (let j = 0; j < nRow; j++) {
            let prefer = preferInThreeRow[j%3].slice()
            prefer = prefer.map ((e) => e===T ? 'Tea' : (e===C)? 'Coffee':'Water')
            for (let i = 0; i < nCol; i++) {
                let ind = Math.floor(Math.random() * prefer.length)
                let given = prefer[ind]
                prefer.splice(ind, 1)          //delete element from array

                let seat = this.createSeat (j, i, given)
                this.seats.push (seat)
            }
        }
        this.openCodeStr = this.randomString (32)
        this.secretKeyStr = this.randomString (20)
        this.drinksStr = []
        for (let j = 0, k = 0; j < nRow; j++) {
            this.drinksStr += (j+1)
            for (let i = 0; i < nCol; i++) {
                this.drinksStr += this.givenToLetter[this.seats[k++].given]
            }
        }
        this.calcPrizeMax ()
    },

    createSeat (row, col, given) {
        let index = this.getIndex (row, col)

        return {
            row: row,
            col: col,
            given: given,               //drink that seat prefer, can be 'Tea', 'Coffee', 'TeaCoffee'

            index: index,               //index of cell in cells array
            served: false,              //seat was served
            isQuestionTea: false,       //was ordered tea
            isQuestionCoffee: false,    //was ordered coffee
            isQuestionTeaCoffee: false  //was ordered tea-coffee
        }
    },

    getIndex(j, i)  {return j * game.nCol + i},
    getRow (ind)    {return Math.floor(ind / game.nCol)},
    getCol (ind)    {return ind % game.nCol},

    getSeatName (ind)  {
        const letters = 'ABCDEFGHIJKLM'
        return  (this.getRow (ind)+1) + letters.charAt(this.getCol (ind))
    }
}

export default game