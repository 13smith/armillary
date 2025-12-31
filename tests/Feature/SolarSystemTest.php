<?php

it('renders solar system page', function () {
    $response = $this->get('/3d-solar-system');

    $response->assertOk()
        ->assertInertia(fn ($page) => $page->component('solar-system/index'));
});
