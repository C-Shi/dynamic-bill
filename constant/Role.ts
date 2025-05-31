class Role {
    constructor(name: String, description: String, emoji: String) {
        this.name = name;
        this.description = description;
        this.emoji = emoji;
    }
    name: String;
    description: String;
    emoji: String;
}

export const Roles = [
    new Role(
        "Big Spender",
        "Paid upfront in more than 50% of activities",
        "💸"
    ),
    new Role(
        "Early Payer",
        "Net balance is positive",
        "⏱️"
    ),
    new Role(
        "Even Splitter",
        "Net balance is close to zero",
        "🤝"
    ),
    new Role(
        "Chill Payer",
        "You take your time, but it all works out in the end",
        "🧊"
    )
]