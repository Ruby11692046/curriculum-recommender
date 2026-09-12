class UserProfile {
    constructor() {
        this.takenSubjects = [];
        this.difficultSubjects = [];
        this.questionAnswers = [];
        this.genreScores = {};
        this.traits = {};
    }
}

export const userProfile = new UserProfile();