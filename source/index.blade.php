@extends('_layouts.app')

@section('body')
<div id="header" class="sticky">
	<div class="container">
		@include('_partials.filters')
	</div>
</div>
<div id="main">
	<div class="container">
		<div class="row gx-3">
			@foreach ($page->data->games as $game)
				@include('_partials.game-card')
			@endforeach
		</div>
	</div>
</div>
@endsection