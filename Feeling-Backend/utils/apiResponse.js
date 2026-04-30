function APiResponse(statsCode, data, message = "Success") {
  return { statsCode, data, message, sussess: statsCode < 400 };
}

export { APiResponse };
