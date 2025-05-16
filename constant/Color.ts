const Colors = {
    Primary: "#4A90E2",
    Light: "#B0D4F1",
    Secondary: "#9B6ADE",
    Background: "#FFFFFF",
    Card: "#E9ECEF",
    Main: "#2D3436",
    SubText: "#6C757D",
    Danger: "#FF3B30",
    Success: "#16A34A",
    Dark: "#000000",
    Coffee: "#b45309",
}

class ColorSet {
    public static generateRandomColor() {
        const hex = Math.random().toString(16).slice(2, 8).padEnd(6, '0')
        return `#${hex}`
    }
    public static newSet(count: number) {
        const colorSet = [Colors.Primary, Colors.Secondary, '#ED6665', '#FFD9A0', '#D6C1FF', '#4CD964', '#F5A623', '#50E3C2', '#B8E986', '#FFB6C1']
        for (let i = 0; i < count - colorSet.length; i++) {
            colorSet.push(this.generateRandomColor())
        }

        return colorSet;
    }
}

export { ColorSet };

export default Colors;