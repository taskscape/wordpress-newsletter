<?php
/**
 * Plugin Name: Taskscape Newsletter Popup
 * Description: Shows a popup with an e-mail form, sends the data to the specified address and saves a cookie.
 * Version: 1.0
 * Author: Patryk Nowak, Taskscape L.t.d.
 */

add_action('wp_enqueue_scripts', 'tbnp_enqueue_scripts');
function tbnp_enqueue_scripts() {
    wp_enqueue_script('tbnp-script', plugin_dir_url(__FILE__) . 'popup.js', [], null, true);
    wp_enqueue_style('tbnp-style', plugin_dir_url(__FILE__) . 'popup.css');
    wp_localize_script('tbnp-script', 'tbnp_ajax', [
        'ajax_url' => admin_url('admin-ajax.php'),
    ]);
}

add_action('wp_footer', 'tbnp_add_popup_html');
function tbnp_add_popup_html() {
    if (!is_single()) return;
    if (!has_category('Baza Wiedzy')) return;
    ?>
<div id="tbnp-popup">
  <div id="tbnp-popup-content">
    <img src="<?php echo plugin_dir_url(__FILE__) . 'images/modal-newsletter.png'; ?>" alt="Newsletter" id="tbnp-image" />
    <div class="tbnp-inner">
      <h5>Bądź na bieżąco z naszymi nowościami</h5>
      <input type="email" id="tbnp-email" placeholder="Twój adres e-mail">
      <small id="tbnp-error" style="color:red; display:none; text-align: justify;">Proszę podać adres e-mail</small>
      <small id="tbnp-message" style="color: green; display: none; text-align: justify;"></small>
      <button onclick="tbnpSubmit()">Zapisz się teraz</button>
    </div>
  </div>
</div>

    <?php
}

add_action('wp_ajax_tbnp_submit', 'tbnp_handle_submission');
add_action('wp_ajax_nopriv_tbnp_submit', 'tbnp_handle_submission');

function tbnp_handle_submission() {
    if (!isset($_POST['email'])) wp_die();

    $email = sanitize_email($_POST['email']);
    $site_name = home_url();

    $message = "Użytkownik $email jest zainteresowany ofertą strony $site_name";

    wp_mail('patryknowak@intmail.pl', 'Nowe zgłoszenie z popupu', $message);

    wp_die(); // zakończ ajax
}
