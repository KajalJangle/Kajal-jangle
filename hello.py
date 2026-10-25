# Ayurvedic Classification as a Rule-Based Expert System

def classify_dosha(body, appetite, sleep, activity):

    # Initialize scores
    vata = 0
    pitta = 0
    kapha = 0

    # Rule 1: Body tendency
    if body == "dry":
        vata += 1
    elif body == "warm":
        pitta += 1
    elif body == "heavy":
        kapha += 1

    # Rule 2: Appetite
    if appetite == "irregular":
        vata += 1
    elif appetite == "strong":
        pitta += 1
    elif appetite == "steady":
        kapha += 1

    # Rule 3: Sleep pattern
    if sleep == "light":
        vata += 1
    elif sleep == "moderate":
        pitta += 1
    elif sleep == "deep":
        kapha += 1

    # Rule 4: Activity pattern
    if activity == "restless":
        vata += 1
    elif activity == "intense":
        pitta += 1
    elif activity == "slow":
        kapha += 1

    # Store scores
    scores = {
        "Vata": vata,
        "Pitta": pitta,
        "Kapha": kapha
    }

    # Find highest score
    highest = max(scores.values())

    winners = [
        dosha for dosha, score in scores.items()
        if score == highest
    ]

    # Classification
    if len(winners) == 1:
        result = winners[0]
    else:
        result = "Mixed/Indeterminate"

    return result, scores


# Main Program
print("=" * 45)
print(" AYURVEDIC DOSHA CLASSIFICATION SYSTEM")
print("=" * 45)

print("\nChoose the following characteristics:")

body = input("Body tendency (dry/warm/heavy): ").lower()
appetite = input("Appetite (irregular/strong/steady): ").lower()
sleep = input("Sleep (light/moderate/deep): ").lower()
activity = input("Activity (restless/intense/slow): ").lower()

# Call the expert system
result, scores = classify_dosha(
    body, appetite, sleep, activity
)

# Display results
print("\n" + "-" * 45)
print("DOSHA SCORES")
print("-" * 45)

print("Vata  :", scores["Vata"])
print("Pitta :", scores["Pitta"])
print("Kapha :", scores["Kapha"])

print("-" * 45)
print("CLASSIFICATION:", result)
print("-" * 45)