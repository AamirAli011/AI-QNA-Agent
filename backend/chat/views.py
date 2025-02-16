import requests

from django.conf import settings

from rest_framework.decorators import api_view
from rest_framework.response import Response

# Store conversation history in memory
conversation_history = {}

# Load API key
api_key = settings.GEMINI_API_KEY


@api_view(["POST"])
def chat_with_ai(request):
    global conversation_history

    # Use a unique identifier for the user; defaulting to "default_user" if not provided
    user_id = request.data.get("user_id", "default_user")
    user_query = request.data.get("query")

    if not user_query:
        return Response({"error": "Query is required"}, status=400)

    # Initialize the conversation history for this user if it doesn't exist
    if user_id not in conversation_history:
        conversation_history[user_id] = []

    # Append the user's query to the conversation history with the role "user"
    conversation_history[user_id].append({"role": "user", "content": user_query})

    # Prepare the history for the Gemini API.
    # Map the role "assistant" to "model" because Gemini requires valid roles: "user" or "model".
    history_for_gemini = []
    for msg in conversation_history[user_id]:
        role = msg["role"]
        if role == "assistant":
            role = "model"
        history_for_gemini.append({
            "role": role,
            "parts": [{"text": msg["content"]}]
        })

    # Build the Gemini API request URL and payload.
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {"contents": history_for_gemini}

    try:
        response = requests.post(
            url, 
            json=payload, 
            headers={"Content-Type": "application/json"}
        )
        response_data = response.json()

        # Check if Gemini returned an error
        if "error" in response_data:
            return Response({"error": response_data["error"]["message"]}, status=400)

        # Extract the AI's response from the Gemini API response.
        # The API returns candidates; we take the first candidate.
        ai_response = response_data.get("candidates", [{}])[0] \
            .get("content", {}) \
            .get("parts", [{}])[0] \
            .get("text", "No response")

        # Append the AI's response to the conversation history using the role "assistant"
        conversation_history[user_id].append({"role": "assistant", "content": ai_response})

        # Return the updated conversation history.
        return Response({"history": conversation_history[user_id]})

    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=500)
    