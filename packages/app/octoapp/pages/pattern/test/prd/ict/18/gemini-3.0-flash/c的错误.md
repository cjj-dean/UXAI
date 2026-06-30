2026-05-12 09:42:03 - INFO - HTTP Request: POST https://openrouter.ai/api/v1/chat/completions "HTTP/1.1 400 Bad Request"
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\uvicorn\protocols\http\h11_impl.py", line 410, in run_asgi
    result = await app(  # type: ignore[func-returns-value]
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        self.scope, self.receive, self.send
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\uvicorn\middleware\proxy_headers.py", line 60, in __call__
    return await self.app(scope, receive, send)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\fastapi\applications.py", line 1139, in __call__
    await super().__call__(scope, receive, send)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\applications.py", line 107, in __call__
    await self.middleware_stack(scope, receive, send)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\middleware\errors.py", line 186, in __call__
    raise exc
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\middleware\errors.py", line 164, in __call__
    await self.app(scope, receive, _send)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\middleware\cors.py", line 93, in __call__
    await self.simple_response(scope, receive, send, request_headers=headers)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\middleware\cors.py", line 144, in simple_response
    await self.app(scope, receive, send)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\middleware\exceptions.py", line 63, in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\fastapi\middleware\asyncexitstack.py", line 18, in __call__
    await self.app(scope, receive, send)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\routing.py", line 716, in __call__
    await self.middleware_stack(scope, receive, send)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\routing.py", line 736, in app
    await route.handle(scope, receive, send)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\routing.py", line 290, in handle
    await self.app(scope, receive, send)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\fastapi\routing.py", line 119, in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\fastapi\routing.py", line 106, in app
    await response(scope, receive, send)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\responses.py", line 269, in __call__
    with collapse_excgroups():
         ~~~~~~~~~~~~~~~~~~^^
  File "d:\environment\miniconda\envs\gui\Lib\contextlib.py", line 162, in __exit__
    self.gen.throw(value)
    ~~~~~~~~~~~~~~^^^^^^^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\_utils.py", line 85, in collapse_excgroups
    raise exc
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\responses.py", line 273, in wrap
    await func()
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\starlette\responses.py", line 253, in stream_response
    async for chunk in self.body_iterator:
    ...<2 lines>...
        await send({"type": "http.response.body", "body": chunk, "more_body": True})
  File "D:\桌面\GenUIAgent\genui-agent\main.py", line 153, in event_generator
    async for output in graph_app.astream(initial_state, config=config):
    ...<21 lines>...
        yield f"data: {json.dumps(output, ensure_ascii=False)}\n\n"
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langgraph\pregel\main.py", line 3181, in astream
    async for _ in runner.atick(
    ...<16 lines>...
            yield o
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langgraph\pregel\_runner.py", line 304, in atick
    await arun_with_retry(
    ...<15 lines>...
    )
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langgraph\pregel\_retry.py", line 242, in arun_with_retry
    return await task.proc.ainvoke(task.input, config)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langgraph\_internal\_runnable.py", line 705, in ainvoke
    input = await asyncio.create_task(
            ^^^^^^^^^^^^^^^^^^^^^^^^^^
        step.ainvoke(input, config, **kwargs), context=context
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langgraph\_internal\_runnable.py", line 473, in ainvoke
    ret = await self.afunc(*args, **kwargs)
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langchain_core\runnables\config.py", line 667, in run_in_executor
    return await asyncio.get_running_loop().run_in_executor(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<2 lines>...
    )
    ^
  File "d:\environment\miniconda\envs\gui\Lib\concurrent\futures\thread.py", line 86, in run
    result = ctx.run(self.task)
  File "d:\environment\miniconda\envs\gui\Lib\concurrent\futures\thread.py", line 73, in run
    return fn(*args, **kwargs)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langchain_core\runnables\config.py", line 658, in wrapper
    return func(*args, **kwargs)
  File "D:\桌面\GenUIAgent\genui-agent\agents\genui_agent\node.py", line 1905, in genui_json_node
    result = genui_agent.invoke({"messages": [HumanMessage(content=humanPrompt)]})
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langgraph\pregel\main.py", line 3365, in invoke
    for chunk in self.stream(
                 ~~~~~~~~~~~^
        input,
        ^^^^^^
    ...<10 lines>...
        **kwargs,
        ^^^^^^^^^
    ):
    ^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langgraph\pregel\main.py", line 2759, in stream
    for _ in runner.tick(
             ~~~~~~~~~~~^
        [t for t in loop.tasks.values() if not t.writes],
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<2 lines>...
        schedule_task=loop.accept_push,
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ):
    ^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langgraph\pregel\_runner.py", line 167, in tick
    run_with_retry(
    ~~~~~~~~~~~~~~^
        t,
        ^^
    ...<10 lines>...
        },
        ^^
    )
    ^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langgraph\pregel\_retry.py", line 126, in run_with_retry
    return task.proc.invoke(task.input, config)
           ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langgraph\_internal\_runnable.py", line 656, in invoke
    input = context.run(step.invoke, input, config, **kwargs)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langgraph\_internal\_runnable.py", line 393, in invoke
    ret = context.run(self.func, *args, **kwargs)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langgraph\prebuilt\chat_agent_executor.py", line 679, in call_model
    response = cast(AIMessage, static_model.invoke(model_input, config))  # type: ignore[union-attr]
                               ~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langchain_core\runnables\base.py", line 3157, in invoke
    input_ = context.run(step.invoke, input_, config)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langchain_core\runnables\base.py", line 5695, in invoke
    return self.bound.invoke(
           ~~~~~~~~~~~~~~~~~^
        input,
        ^^^^^^
        self._merge_configs(config),
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        **{**self.kwargs, **kwargs},
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langchain_core\language_models\chat_models.py", line 455, in invoke
    self.generate_prompt(
    ~~~~~~~~~~~~~~~~~~~~^
        [self._convert_input(input)],
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<6 lines>...
        **kwargs,
        ^^^^^^^^^
    ).generations[0][0],
    ^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langchain_core\language_models\chat_models.py", line 1198, in generate_prompt
    return self.generate(prompt_messages, stop=stop, callbacks=callbacks, **kwargs)
           ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langchain_core\language_models\chat_models.py", line 1005, in generate
    self._generate_with_cache(
    ~~~~~~~~~~~~~~~~~~~~~~~~~^
        m,
        ^^
    ...<2 lines>...
        **kwargs,
        ^^^^^^^^^
    )
    ^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langchain_core\language_models\chat_models.py", line 1310, in _generate_with_cache
    result = self._generate(
        messages, stop=stop, run_manager=run_manager, **kwargs
    )
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langchain_openai\chat_models\base.py", line 1501, in _generate
    _handle_openai_bad_request(e)
    ~~~~~~~~~~~~~~~~~~~~~~~~~~^^^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\langchain_openai\chat_models\base.py", line 1498, in _generate
    raw_response = self.client.with_raw_response.create(**payload)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\openai\_legacy_response.py", line 367, in wrapped
    return cast(LegacyAPIResponse[R], func(*args, **kwargs))
                                      ~~~~^^^^^^^^^^^^^^^^^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\openai\_utils\_utils.py", line 298, in wrapper
    return func(*args, **kwargs)
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\openai\resources\chat\completions\completions.py", line 1215, in create
    return self._post(
           ~~~~~~~~~~^
        "/chat/completions",
        ^^^^^^^^^^^^^^^^^^^^
    ...<51 lines>...
        stream_cls=Stream[ChatCompletionChunk],
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\openai\_base_client.py", line 1332, in post
    return cast(ResponseT, self.request(cast_to, opts, stream=stream, stream_cls=stream_cls))
                           ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "d:\environment\miniconda\envs\gui\Lib\site-packages\openai\_base_client.py", line 1105, in request
    raise self._make_status_error_from_response(err.response) from None
openai.BadRequestError: Error code: 400 - {'error': {'message': 'Provider returned error', 'code': 400, 'metadata': {'raw': '{\n  "error": {\n    "code": 400,\n    "message": "The referenced name `#/definitions/DynamicString` in function_response.response does not match to a display_name in the function_response.parts.",\n    "status": "INVALID_ARGUMENT"\n  }\n}\n', 'provider_name': 'Google AI Studio', 'is_byok': False}}, 'user_id': 'user_3D0pqp6dqCRKF2hQKnBRxFb1kwz'}
During task with name 'agent' and id 'b7c1b45e-3b68-7b67-a9db-ea40e8018589'
During task with name 'generate_json' and id '5c57bc04-39f3-f4e8-06a6-2e7411105245'