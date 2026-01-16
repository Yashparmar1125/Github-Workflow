const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({
            version: 'stash.v1',
            status: {
                http: 405,
                code: 'method_not_allowed',
                message: 'Only POST is supported'
            },
            data: null,
            error: {
                type: 'client',
                details: {
                    method: req.method
                }
            }
        });
        return;
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        res.status(500).json({
            version: 'stash.v1',
            status: {
                http: 500,
                code: 'missing_api_key',
                message: 'Server is missing OpenRouter API key'
            },
            data: null,
            error: {
                type: 'server',
                details: null
            }
        });
        return;
    }

    const rawBody = req.body;
    let payload = rawBody || {};
    if (typeof rawBody === 'string') {
        try {
            payload = JSON.parse(rawBody || '{}');
        } catch (parseError) {
            res.status(400).json({
                version: 'stash.v1',
                status: {
                    http: 400,
                    code: 'invalid_json',
                    message: 'Request body is not valid JSON'
                },
                data: null,
                error: {
                    type: 'client',
                    details: null
                }
            });
            return;
        }
    }

    try {
        const referer = req.headers['x-forwarded-host'] || req.headers.host || '';
        const upstreamResponse = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + apiKey,
                'HTTP-Referer': referer,
                'X-Title': 'Git Protocol Handbook'
            },
            body: JSON.stringify(payload)
        });

        const data = await upstreamResponse.json();
        const choice = data && data.choices && data.choices[0];
        const message = choice && choice.message && choice.message.content ? String(choice.message.content) : '';
        const reasoning = choice && (choice.reasoning || choice.reasoning_details) ? choice.reasoning || choice.reasoning_details : null;

        if (!upstreamResponse.ok) {
            res.status(upstreamResponse.status).json({
                version: 'stash.v1',
                status: {
                    http: upstreamResponse.status,
                    code: 'upstream_error',
                    message: 'Upstream model request failed'
                },
                data: null,
                error: {
                    type: 'upstream',
                    details: {
                        status: upstreamResponse.status
                    }
                }
            });
            return;
        }

        if (!message) {
            res.status(502).json({
                version: 'stash.v1',
                status: {
                    http: 502,
                    code: 'invalid_upstream_payload',
                    message: 'Upstream response did not include a message'
                },
                data: null,
                error: {
                    type: 'upstream',
                    details: null
                }
            });
            return;
        }

        res.status(200).json({
            version: 'stash.v1',
            status: {
                http: 200,
                code: 'ok',
                message: 'Success'
            },
            data: {
                id: data && data.id ? data.id : null,
                model: data && data.model ? data.model : payload && payload.model ? payload.model : null,
                message: {
                    role: choice.message && choice.message.role ? choice.message.role : 'assistant',
                    content: message
                },
                reasoning: reasoning
            },
            error: null
        });
    } catch (error) {
        res.status(500).json({
            version: 'stash.v1',
            status: {
                http: 500,
                code: 'internal_error',
                message: 'Failed to contact model backend'
            },
            data: null,
            error: {
                type: 'server',
                details: null
            }
        });
    }
}

module.exports = handler;

