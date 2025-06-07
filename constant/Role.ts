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
        "Paid upfront in more than 50% of activities",
        "💸"
    ),
    earlyPayer: new Role(
        "Early Payer",
        "Net balance is positive",
        "⏱️"
    ),
    evenSplitter: new Role(
        "Even Splitter",
        "Net balance is close to zero",
        "🤝"
    ),
    chillPayer: new Role(
        "Chill Payer",
        "You take your time, but it all works out in the end",
        "🧊"
    )
}