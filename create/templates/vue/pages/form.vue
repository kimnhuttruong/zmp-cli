<template>
  <zmp-page name="form">
    <zmp-navbar title="Form" back-link="Back"></zmp-navbar>

    <zmp-block-title>Form Example</zmp-block-title>
    <zmp-list no-hairlines-md>
      <zmp-list-input
        label="Name"
        type="text"
        placeholder="Your name"
      ></zmp-list-input>

      <zmp-list-input
        label="E-mail"
        type="email"
        placeholder="E-mail"
      ></zmp-list-input>

      <zmp-list-input
        label="URL"
        type="url"
        placeholder="URL"
      ></zmp-list-input>

      <zmp-list-input
        label="Password"
        type="password"
        placeholder="Password"
      ></zmp-list-input>

      <zmp-list-input
        label="Phone"
        type="tel"
        placeholder="Phone"
      ></zmp-list-input>

      <zmp-list-input
        label="Gender"
        type="select"
        >
        <option>Male</option>
        <option>Female</option>
      </zmp-list-input>

      <zmp-list-input
        label="Birth date"
        type="date"
        placeholder="Birth day"
        defaultValue="2014-04-30"
      ></zmp-list-input>

      <zmp-list-item
        title="Toggle"
      >
        <template #after>
          <zmp-toggle />
        </template>
      </zmp-list-item>

      <zmp-list-input
        label="Range"
        :input="false"
      >
        <template #input>
          <zmp-range :value="50" :min="0" :max="100" :step="1" />
        </template>
      </zmp-list-input>

      <zmp-list-input
        type="textarea"
        label="Textarea"
        placeholder="Bio"
      ></zmp-list-input>
      <zmp-list-input
        type="textarea"
        label="Resizable"
        placeholder="Bio"
        resizable
      ></zmp-list-input>
    </zmp-list>

    <zmp-block-title>Buttons</zmp-block-title>
    <zmp-block strong>
      <zmp-row tag="p">
        <zmp-button class="col">Button</zmp-button>
        <zmp-button class="col" fill>Fill</zmp-button>
      </zmp-row>
      <zmp-row tag="p">
        <zmp-button class="col" raised>Raised</zmp-button>
        <zmp-button class="col" raised fill>Raised Fill</zmp-button>
      </zmp-row>
      <zmp-row tag="p">
        <zmp-button class="col" round>Round</zmp-button>
        <zmp-button class="col" round fill>Round Fill</zmp-button>
      </zmp-row>
      <zmp-row tag="p">
        <zmp-button class="col" outline>Outline</zmp-button>
        <zmp-button class="col" round outline>Outline Round</zmp-button>
      </zmp-row>
      <zmp-row tag="p">
        <zmp-button class="col" small outline>Small</zmp-button>
        <zmp-button class="col" small round outline>Small Round</zmp-button>
      </zmp-row>
      <zmp-row tag="p">
        <zmp-button class="col" small fill>Small</zmp-button>
        <zmp-button class="col" small round fill>Small Round</zmp-button>
      </zmp-row>
      <zmp-row tag="p">
        <zmp-button class="col" large raised>Large</zmp-button>
        <zmp-button class="col" large fill raised>Large Fill</zmp-button>
      </zmp-row>
      <zmp-row tag="p">
        <zmp-button class="col" large fill raised color="red">Large Red</zmp-button>
        <zmp-button class="col" large fill raised color="green">Large Green</zmp-button>
      </zmp-row>
    </zmp-block>

    <zmp-block-title>Checkbox group</zmp-block-title>
    <zmp-list>
      <zmp-list-item
        checkbox
        name="my-checkbox"
        value="Books"
        title="Books"
      ></zmp-list-item>
      <zmp-list-item
        checkbox
        name="my-checkbox"
        value="Movies"
        title="Movies"
      ></zmp-list-item>
      <zmp-list-item
        checkbox
        name="my-checkbox"
        value="Food"
        title="Food"
      ></zmp-list-item>
    </zmp-list>

    <zmp-block-title>Radio buttons group</zmp-block-title>
    <zmp-list>
      <zmp-list-item
        radio
        name="radio"
        value="Books"
        title="Books"
      ></zmp-list-item>
      <zmp-list-item
        radio
        name="radio"
        value="Movies"
        title="Movies"
      ></zmp-list-item>
      <zmp-list-item
        radio
        name="radio"
        value="Food"
        title="Food"
      ></zmp-list-item>
    </zmp-list>
  </zmp-page>
</template>
