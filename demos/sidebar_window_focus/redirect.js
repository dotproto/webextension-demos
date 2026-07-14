{
  // HACK: Add a UUID to the sidebar URL to ensure that we can uniquely identify
  // each open sidebar
  const documentUrl = new URL(window.location);
  const queryParams = Array.from(documentUrl.searchParams.keys());
  if (!queryParams.includes('uuid')) {
    documentUrl.searchParams.append('uuid', crypto.randomUUID());
    window.location = documentUrl.toString();
  }
}
