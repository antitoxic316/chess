class ChessBoard{
    constructor(container, size=400){
        this.chessBoard = document.createElement("table")
        container.appendChild(this.chessBoard)
    }

    pieceIsActive = false

    createChessBoardForBlack(){
        let columns = "abcdefgh"
        for(let i = 0; i <= 7; i++){
            let row = this.chessBoard.insertRow(-1)
            for(let j = 0; j <= 7; j++){
                let cell = row.insertCell(0)
                cell.id = `${columns[j]}${i+1}`
                if((i+j) % 2 == 0){
                    cell.className = "black"
                } else {
                    cell.className = "white"
                }
            }
        }
    }

    createChessBoardForWhite(){
        let columns = "abcdefgh"
        for(let i = 0; i <= 7; i++){
            let row = this.chessBoard.insertRow(0)
            for(let j = 0; j <= 7; j++){
                let cell = row.insertCell(-1)
                cell.id = `${columns[j]}${i+1}`
                if((i+j) % 2 == 0){
                    cell.className = "black"
                } else {
                    cell.className = "white"
                }
            }
        }
    }
}

class Piece{
    constructor(container, isPieceBlack) {
        if (this.constructor == Piece){
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
    
    #getLegalMoves(){
        throw new Error("Method 'move()' must be implemented.");
    }

    spawn(coordinates){
        // spawn any piece at any coordinate
    }

    transformCoordsFromChess(coords){
        let boardLetters = "abcdefgh"
        let x = boardLetters.indexOf(coords[0]) + 1
        let y = Number(coords[1])

        return [x, y]
    }

    transformCoordsToChess(coords){
        let boardLetters = "abcdefgh"
        let x = boardLetters[coords[0]-1]
        let y = coords[1]

        return x+y
    }
}

class Pawn extends Piece{
    currentCoords = null
    isDown = false
    clone = null

    constructor(container, isPieceBlack){
        super(container, isPieceBlack)

        this.pawn = document.createElement("div")

        this.color = "white"
        if (isPieceBlack){
            this.color = "black"
        }

        this.pawn.classList = `pawn ${this.color}`
        this.pawn.innerText = "p"
        this.pawn.style.position = "relative"

        this.container = container

        this.clone = this.pawn.cloneNode(true)

        this.#addEventListeners()
    }

    spawn(coords){
        if(this.currentCoords !== null){
            document.querySelector(`#${this.container.id}`).querySelector(`#${coords}`).innerHTML = ''
        }
        this.currentCoords = coords
        let cell = document.querySelector(`#${this.container.id}`).querySelector(`#${coords}`)
        cell.appendChild(this.pawn)
    }

    getLegalMoves(){
        let legalMoves = []

        let xyCoords = this.transformCoordsFromChess(this.currentCoords)
        let possibleCoords = xyCoords

        if (this.color == "white"){
            // if pawn on the starting position
            if (xyCoords[1] == 2){
                possibleCoords[1] += 1
                legalMoves.push(this.transformCoordsToChess(possibleCoords))
                possibleCoords[1] += 1
                legalMoves.push(this.transformCoordsToChess(possibleCoords))
            } else {
                possibleCoords[1] += 1
                legalMoves.push(this.transformCoordsToChess(possibleCoords))
            }
        } else if (this.color == "black"){
            // if pawn on the starting position
            if (xyCoords[1] == 7){
                possibleCoords[1] -= 1
                legalMoves.push(this.transformCoordsToChess(possibleCoords))
                possibleCoords[1] -= 1
                legalMoves.push(this.transformCoordsToChess(possibleCoords))
            } else {
                possibleCoords[1] -= 1
                legalMoves.push(this.transformCoordsToChess(possibleCoords))
            }
        }

        return legalMoves
    }

    showLegalMoves(){
        this.showedMoves = {}
        for (let move of this.getLegalMoves()){    
            let cell = document.querySelector(`#${this.container.id}`).querySelector(`#${move}`)
            this.showedMoves[`${move}`] = cell
            cell.style.backgroundColor = "red"
        }
    }

    unshowLegalMoves(){
        for (let [move, cell] of Object.entries(this.showedMoves)) {
            document.querySelector(`#${this.container.id}`).querySelector(`#${move}`).style.backgroundColor = cell.className
        }
    }

    #addEventListeners(){
        this.pawn.onmousedown=(event)=>{
            this.showLegalMoves()

            this.isDown = true

            this.clone = this.pawn.cloneNode(true)
            this.clone.style.left = event.clientX + 'px'
            this.clone.style.top = event.clientY + 'px'
            this.clone.style.position = "absolute"
            this.container.appendChild(this.clone)

            this.showLegalMoves()

            
        }

        this.container.onmouseup=(event)=>{
            if(!this.isDown){
                return
            }

            this.isDown = false

            let nextCoords = event.toElement.id

            if(this.getLegalMoves().includes(nextCoords)){
                this.spawn(nextCoords)
                this.unshowLegalMoves()
            } else {
                this.isDown = true
            }

            this.clone.remove()

            console.log(this.container)


        }

        this.container.onmousemove=(event)=>{
            if(this.isDown){
                this.clone.style.left = event.clientX + 'px'
                this.clone.style.top = event.clientY + 'px'
            }
        }
    }
}