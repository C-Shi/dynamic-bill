export class Role {
    constructor(name: string, description: string, emoji: string) {
        this.name = name;
        this.description = description;
        this.emoji = emoji;
    }
    name: string;
    description: string;
    emoji: string;
}

export const Roles = {
    bigSepnder: new Role(
        "Big Spender",
        "You're the one who throws down the card first and figures it out later. Most of the time, you’re covering the squad — and everyone’s grateful.",
        "💸"
    ),
    earlyPayer: new Role(
        "Early Payer",
        "You’ve paid in a few key moments, keeping your balance comfortably in the green. You’re not throwing cash everywhere — just playing the game smart.",
        "⏱️"
    ),
    evenSplitter: new Role(
        "Even Splitter",
        "You’ve mastered the art of balance. You chip in just the right amount, and your numbers are always impressively close to zero. Respect.",
        "🤝"
    ),
    chillPayer: new Role(
        "Chill Payer",
        "You’re relaxed about money — maybe a bit too chill. But hey, it all gets sorted eventually, and no one’s stressing. We see you.",
        "🧊"
    )
}