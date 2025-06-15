export class CalcRating {
    calculateRating(ratingPlayer1, ratingPlayer2, gameScoreboard, k = 32) {
        let result;
        if (gameScoreboard.isDraw()) {
            result = 'draw';
        }
        else if (gameScoreboard.getWinner() == gameScoreboard.player1) {
            result = 'win';
        }
        else if (gameScoreboard.getWinner() == gameScoreboard.player2) {
            result = 'loss';
        }
        else {
            result = 'draw';
        }
        const expectedA = 1 / (1 + Math.pow(10, (ratingPlayer2 - ratingPlayer1) / 400));
        const expectedB = 1 - expectedA;
        let scoreA;
        let scoreB;
        switch (result) {
            case 'win':
                scoreA = 1;
                scoreB = 0;
                break;
            case 'loss':
                scoreA = 0;
                scoreB = 1;
                break;
            case 'draw':
                scoreA = 0.5;
                scoreB = 0.5;
                break;
        }
        const newRatingPlayer1 = ratingPlayer1 + k * (scoreA - expectedA);
        const newRatingPlayer2 = ratingPlayer2 + k * (scoreB - expectedB);
        return [Math.round(newRatingPlayer1), Math.round(newRatingPlayer2)];
    }
}
