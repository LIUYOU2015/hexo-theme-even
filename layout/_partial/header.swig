<div class="logo-wrapper">
  <a href="{{ url_for('.') }}" class="logo">{{ config.title }}</a>
</div>

<nav class="site-navbar">
  {% if theme.menu %}
    <ul id="menu" class="menu">
      {% for name, path in theme.menu %}
        <li class="menu-item">
          <a class="menu-item-link" href="{{ url_for(path) }}">
            {% set itemName = __('menu.' + name.toLowerCase()) %}
            {% if itemName.startsWith('menu') %}
              {{ name }}
            {% else %}
              {{ itemName }}
            {% endif %}
          </a>
        </li>
      {% endfor %}
<<<<<<< HEAD

      {% if theme.search %}
      <li class="menu-item">
          <a class="menu-item-link" href="javascript:;" id="search">
              Search
          </a>
      </li>
      {% endif %}

=======
>>>>>>> f897cd88f3de76238b98270a86d50dcdaa906d02
    </ul>
  {% endif %}
</nav>
