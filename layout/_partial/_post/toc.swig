<<<<<<< HEAD
{% if not is_home() and toc(page.content) %}
=======
{% if not is_home() and toc(page.content) and theme.toc %}
>>>>>>> f897cd88f3de76238b98270a86d50dcdaa906d02
  <div class="post-toc" id="post-toc">
    <h2 class="post-toc-title">{{ __('posts.toc') }}</h2>
    <div class="post-toc-content">
      {{ toc(page.content, {list_number: false}) }}
    </div>
  </div>
<<<<<<< HEAD
{% endif %}
=======
{% endif %}
>>>>>>> f897cd88f3de76238b98270a86d50dcdaa906d02
