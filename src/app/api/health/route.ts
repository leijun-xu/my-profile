export async function GET(request: Request) {
    const timestamp = Date.now()
    return Response.json({ status: 'ok', timestamp })
}